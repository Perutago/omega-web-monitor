import JobResult from '../entities/JobResult';

export default interface IJobResultRepository<T extends JobResult> {
    read(jobId: string): Promise<T | undefined>;

    create(entity: T): void;
}