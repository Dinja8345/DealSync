import bcrypt from 'bcrypt';

const verifyPassword = async(planePass: string, hashedPass: string) => {
    const isMatch = await bcrypt.compare(planePass, hashedPass);
    return isMatch;
}

export default verifyPassword;