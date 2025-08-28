const helpers = require('./helpers'); // Importa helpers desde el archivo actual

const runEncryption = async () => {
    const password = process.argv[2]; // Toma la contraseña desde la línea de comandos
    if (!password) {
        console.log('Por favor, proporciona una contraseña para encriptar.');
        return;
    }

    try {
        const hashedPassword = await helpers.EncriptarPass(password);
        console.log('Contraseña encriptada:', hashedPassword);
    } catch (error) {
        console.error('Error al encriptar la contraseña:', error);
    }
};

runEncryption();
