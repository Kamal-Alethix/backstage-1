import express from 'express';
import { Logger } from 'winston';
import { IdentityClient } from '@backstage/plugin-auth-node';

/**
 * Dependencies of the todo-list router
 *
 * @public
 */
interface RouterOptions {
    logger: Logger;
    identity: IdentityClient;
}
/**
 * Creates an express.Router with some endpoints
 * for creating, editing and deleting todo items.
 *
 * @public
 * @param options - the dependencies of the router
 * @returns an express.Router
 *
 */
declare function createRouter(options: RouterOptions): Promise<express.Router>;

export { RouterOptions, createRouter };
