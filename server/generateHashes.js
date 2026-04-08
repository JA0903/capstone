import bcrypt from 'bcrypt';

const generate = async () => {
    const hash1 = await bcrypt.hash('Admin@12345', 10);
    const hash2 = await bcrypt.hash('Client@12345', 10);
    console.log('Admin@capstone.com password hash:');
    console.log(hash1);
    console.log('\nclient@capstone.com password hash:');
    console.log(hash2);
};

generate();
