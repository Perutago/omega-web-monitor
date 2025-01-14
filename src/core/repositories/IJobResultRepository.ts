import JobResult from '../entities/JobResult';

export default interface IJobResultRepository<T extends JobResult> {
    readAsync(jobId: string): Promise<T | undefined>;

    create(entity: T): void;
}