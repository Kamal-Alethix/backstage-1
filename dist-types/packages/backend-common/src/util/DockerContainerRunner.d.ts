import Docker from 'dockerode';
import { ContainerRunner, RunContainerOptions } from './ContainerRunner';
export declare type UserOptions = {
    User?: string;
};
/**
 * A {@link ContainerRunner} for Docker containers.
 *
 * @public
 */
export declare class DockerContainerRunner implements ContainerRunner {
    private readonly dockerClient;
    constructor(options: {
        dockerClient: Docker;
    });
    runContainer(options: RunContainerOptions): Promise<void>;
}
