/**
 * Port Management Utilities
 * Cross-platform port conflict detection and resolution
 */

const net = require('net');
const { spawn, exec } = require('child_process');
const os = require('os');

class PortManager {
  constructor() {
    this.platform = os.platform();
    this.availablePorts = [];
  }

  /**
   * Check if a port is available
   * @param {number} port - Port number to check
   * @returns {Promise<boolean>} - True if port is available
   */
  async isPortAvailable(port) {
    return new Promise((resolve) => {
      const server = net.createServer();
      
      server.listen(port, () => {
        server.close(() => {
          resolve(true);
        });
      });
      
      server.on('error', () => {
        resolve(false);
      });
    });
  }

  /**
   * Find an available port starting from a given port
   * @param {number} startPort - Starting port number
   * @param {number} maxAttempts - Maximum number of ports to check
   * @returns {Promise<number|null>} - Available port or null
   */
  async findAvailablePort(startPort = 3000, maxAttempts = 100) {
    for (let i = 0; i < maxAttempts; i++) {
      const port = startPort + i;
      if (await this.isPortAvailable(port)) {
        console.log(`✅ Found available port: ${port}`);
        return port;
      }
    }
    return null;
  }

  /**
   * Get process information for a specific port (platform-specific)
   * @param {number} port - Port number
   * @returns {Promise<Array>} - Array of process information
   */
  async getPortProcesses(port) {
    return new Promise((resolve, reject) => {
      let command;
      
      if (this.platform === 'win32') {
        // Windows command
        command = `netstat -ano | findstr :${port}`;
      } else {
        // Unix-like systems (macOS, Linux)
        command = `lsof -ti:${port}`;
      }
      
      exec(command, (error, stdout, stderr) => {
        if (error) {
          resolve([]); // No processes found
          return;
        }
        
        if (this.platform === 'win32') {
          // Parse Windows netstat output
          const lines = stdout.trim().split('\n');
          const processes = lines.map(line => {
            const parts = line.trim().split(/\s+/);
            return {
              protocol: parts[0],
              localAddress: parts[1],
              foreignAddress: parts[2],
              state: parts[3],
              pid: parts[4]
            };
          }).filter(proc => proc.pid && proc.pid !== '0');
          resolve(processes);
        } else {
          // Parse Unix lsof output
          const pids = stdout.trim().split('\n').filter(pid => pid);
          const processes = pids.map(pid => ({ pid: pid.trim() }));
          resolve(processes);
        }
      });
    });
  }

  /**
   * Kill processes using a specific port
   * @param {number} port - Port number
   * @returns {Promise<boolean>} - True if successful
   */
  async killPortProcesses(port) {
    const processes = await this.getPortProcesses(port);
    
    if (processes.length === 0) {
      console.log(`ℹ️  No processes found using port ${port}`);
      return true;
    }

    console.log(`🔄 Found ${processes.length} process(es) using port ${port}`);
    
    for (const process of processes) {
      try {
        if (this.platform === 'win32') {
          await this.killWindowsProcess(process.pid);
        } else {
          await this.killUnixProcess(process.pid);
        }
        console.log(`✅ Killed process PID: ${process.pid}`);
      } catch (error) {
        console.error(`❌ Failed to kill process PID: ${process.pid}`, error.message);
        return false;
      }
    }
    
    // Wait a moment for processes to actually terminate
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verify port is now available
    const isAvailable = await this.isPortAvailable(port);
    if (isAvailable) {
      console.log(`✅ Port ${port} is now available`);
      return true;
    } else {
      console.error(`❌ Port ${port} is still in use after cleanup attempt`);
      return false;
    }
  }

  /**
   * Kill a Windows process by PID
   * @param {string} pid - Process ID
   * @returns {Promise<void>}
   */
  async killWindowsProcess(pid) {
    return new Promise((resolve, reject) => {
      exec(`taskkill /PID ${pid} /F`, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Kill a Unix process by PID
   * @param {string} pid - Process ID
   * @returns {Promise<void>}
   */
  async killUnixProcess(pid) {
    return new Promise((resolve, reject) => {
      exec(`kill -9 ${pid}`, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Get detailed port information with process details
   * @param {number} port - Port number
   * @returns {Promise<Object>} - Port information
   */
  async getPortInfo(port) {
    const isAvailable = await this.isPortAvailable(port);
    const processes = await this.getPortProcesses(port);
    
    return {
      port,
      available: isAvailable,
      processes,
      platform: this.platform,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Smart port resolution: try to free the port or find alternative
   * @param {number} preferredPort - Preferred port number
   * @param {boolean} autoKill - Whether to attempt killing processes
   * @returns {Promise<number>} - Available port
   */
  async resolvePort(preferredPort = 3000, autoKill = false) {
    console.log(`🔍 Checking port ${preferredPort} availability...`);
    
    const isAvailable = await this.isPortAvailable(preferredPort);
    
    if (isAvailable) {
      console.log(`✅ Port ${preferredPort} is available`);
      return preferredPort;
    }
    
    console.log(`⚠️  Port ${preferredPort} is in use`);
    
    if (autoKill) {
      console.log(`🔄 Attempting to free port ${preferredPort}...`);
      const killed = await this.killPortProcesses(preferredPort);
      
      if (killed) {
        const nowAvailable = await this.isPortAvailable(preferredPort);
        if (nowAvailable) {
          return preferredPort;
        }
      }
    }
    
    console.log(`🔍 Searching for alternative port starting from ${preferredPort + 1}...`);
    const alternativePort = await this.findAvailablePort(preferredPort + 1);
    
    if (alternativePort) {
      console.log(`✅ Using alternative port: ${alternativePort}`);
      return alternativePort;
    }
    
    throw new Error(`❌ No available ports found starting from ${preferredPort}`);
  }

  /**
   * Generate port conflict resolution guide
   * @param {number} port - Conflicted port
   * @returns {Promise<Object>} - Resolution guide
   */
  async generateResolutionGuide(port) {
    const portInfo = await this.getPortInfo(port);
    const alternativePort = await this.findAvailablePort(port + 1);
    
    const guide = {
      port,
      status: portInfo.available ? 'available' : 'in_use',
      processes: portInfo.processes,
      platform: this.platform,
      alternativePort,
      resolutionOptions: []
    };

    if (!portInfo.available) {
      if (this.platform === 'win32') {
        guide.resolutionOptions.push({
          method: 'manual_kill_windows',
          description: `Kill processes using port ${port} (Windows)`,
          commands: [
            `netstat -ano | findstr :${port}`,
            'taskkill /PID [PID] /F'
          ]
        });
      } else {
        guide.resolutionOptions.push({
          method: 'manual_kill_unix',
          description: `Kill processes using port ${port} (Unix/macOS)`,
          commands: [
            `lsof -ti:${port}`,
            `kill -9 $(lsof -ti:${port})`
          ]
        });
      }
      
      guide.resolutionOptions.push({
        method: 'use_alternative_port',
        description: `Use alternative port ${alternativePort}`,
        commands: [
          `PORT=${alternativePort} npm start`
        ]
      });
      
      guide.resolutionOptions.push({
        method: 'automatic_resolution',
        description: 'Use automatic port resolution (recommended)',
        commands: [
          'npm run start:auto'
        ]
      });
    }

    return guide;
  }
}

module.exports = PortManager;