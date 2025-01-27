import IEntity from '../entities/JobResult';

export default interface IJobResultRepository {
    readAll(): Promise<IEntity[]>;

    read(jobId: string): Promise<IEntity | undefined>;

    create(entity: IEntity): void;
}
