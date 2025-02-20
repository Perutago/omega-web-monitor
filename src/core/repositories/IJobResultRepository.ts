import IEntity from '../entities/JobResult';

export default interface IJobResultRepository {
    readAll(): Promise<IEntity[]>;

    read(jobSettingId: string): Promise<IEntity | undefined>;

    create(entity: IEntity): void;
}
