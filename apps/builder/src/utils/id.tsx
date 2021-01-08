import { customAlphabet, nanoid } from 'nanoid';

const uid = () => {
    return customAlphabet('1234567890abcdefghijklmnopqrstuvwzyzABCDEFGHIJKLMNOPQRSTUVWZYZ', 10)();
};

const uuid = () => {
    return nanoid();
};

export { uid, uuid };
