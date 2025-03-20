import bcrypt from "bcrypt";

const hashPassword = async(password: string): Promise<string> => {
    const saltRounds = 12;
    const hashedPass = await bcrypt.hash(password, saltRounds);
    return hashedPass;
}

export default hashPassword;