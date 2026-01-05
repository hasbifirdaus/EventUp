//Tipe ini akan "memberitahu" TypeSctipt untuk menambahkan properti baru ke objek Request Express

declare namespace Express {
  export interface Request {
    user?: {
      userId: string;
      roles: string[];
    };
  }
}
