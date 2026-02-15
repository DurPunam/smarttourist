const http = require('http');
const os = require('os');

// Get all network interfaces
function getNetworkIPs() {
  const interfaces = os.networkInterfaces();
  const ips = [];
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push({
          name: name,
          ip: iface.address
        });
      }
    }
  }
  
  return ips;
}

console.log('🔍 Testing Mobile Connection Setup\n');
console.log('═'.repeat(60));

// Get network IPs
const networkIPs = getNetworkIPs();

console.log('\n📡 Your Computer\'s Network IPs:\n');
networkIPs.forEach(({ name, ip }) => {
  console.log(`   ${name}: ${ip}`);
});

console.log('\n' + '═'.repeat(60));
console.log('\n📱 Mobile Access URLs:\n');

networkIPs.forEach(({ name, ip }) => {
  console.log(`   ${name}:`);
  console.log(`   → http://${ip}:3000\n`);
});

console.log('═'.repeat(60));

// Test if ports are listening
console.log('\n🔌 Testing if servers are running...\n');

function testPort(port, name) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/health`, (res) => {
      if (res.statusCode === 200) {
        console.log(`   ✅ ${name} (Port ${port}) - Running`);
        resolve(true);
      } else {
        console.log(`   ⚠️  ${name} (Port ${port}) - Unexpected response: ${res.statusCode}`);
        resolve(false);
      }
    });
    
    req.on('error', () => {
      console.log(`   ❌ ${name} (Port ${port}) - Not running`);
      resolve(false);
    });
    
    req.setTimeout(2000, () => {
      req.destroy();
      console.log(`   ❌ ${name} (Port ${port}) - Timeout`);
      resolve(false);
    });
  });
}

async function runTests() {
  await testPort(5000, 'Backend API');
  await testPort(3000, 'Frontend');
  
  console.log('\n' + '═'.repeat(60));
  console.log('\n📋 Next Steps:\n');
  console.log('   1. Make sure your mobile is on the SAME WiFi');
  console.log('   2. Open mobile browser');
  console.log('   3. Try each URL above');
  console.log('   4. If it doesn\'t work, run firewall commands from FIREWALL_COMMANDS.txt');
  console.log('\n' + '═'.repeat(60));
  console.log('\n');
}

runTests();
