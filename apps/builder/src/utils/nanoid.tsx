import { customAlphabet } from 'nanoid';

const nanoid = () => {
    return customAlphabet('1234567890abcdefghijklmnopqrstuvwzyzABCDEFGHIJKLMNOPQRSTUVWZYZ', 10)();
};

export default nanoid;
