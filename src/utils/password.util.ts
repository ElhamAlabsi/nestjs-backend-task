import * as bcrypt from 'bcrypt'


export async function hashPassword(password: string): Promise<string> {

    const hash = await bcrypt.hash(password, bcrypt.genSaltSync(10));
    return hash;
}