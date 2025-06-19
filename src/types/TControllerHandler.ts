import { Request, Response } from 'express';

export type TControllerHandler = (req: Request, res: Response) => void;