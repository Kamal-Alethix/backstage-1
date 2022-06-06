import { Request } from 'express';
import { z } from 'zod';
export declare function requireRequestBody(req: Request): Promise<unknown>;
export declare const locationInput: z.ZodObject<{
    type: z.ZodString;
    target: z.ZodString;
    presence: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"required">, z.ZodLiteral<"optional">]>>;
}, "strict", z.ZodTypeAny, {
    presence?: "optional" | "required" | undefined;
    type: string;
    target: string;
}, {
    presence?: "optional" | "required" | undefined;
    type: string;
    target: string;
}>;
export declare function validateRequestBody<T>(req: Request, schema: z.Schema<T>): Promise<T>;
export declare function disallowReadonlyMode(readonly: boolean): void;
