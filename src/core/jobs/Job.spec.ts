import Job from './Job';
import IJobSetting, { JobSettingId, JobSettingType } from '../entities/IJobSetting'; // Assuming JobSettingId is exported or defined
import INotificationSetting, { NotificationSettingId, NotificationSettingType } from '../entities/INotificationSetting';
// Assuming JobResult, Notification, NotificationSenderFactory, RepositoryFactory, FetcherFactory, IJob are correctly pathed
import JobResult from '../entities/JobResult';
import Notification from '../notification-senders/Notification';
import NotificationSenderFactory from '../notification-senders/NotificationSenderFactory';
import RepositoryFactory from '../repositories/RepositoryFactory';
import FetcherFactory from './FetcherFactory';
// import IJob from './IJob'; // Not strictly needed for this test file if Job is concrete
import { IJobResultRepository } from '../repositories/IJobResultRepository';
import { INotificationSettingRepository } from '../repositories/INotificationSettingRepository';
import { IFetcher } from './IFetcher';
import { INotificationSender } from '../notification-senders/INotificationSender';
import { UUID } from 'crypto'; // For type compatibility if Brand/JobSettingId use it

// --- Minimalist Brand and Id Types (if not properly imported) ---
type Brand<K, T> = K & { __brand: T };
// If JobSettingId or NotificationSettingId are not imported as concrete types, define them simply for the test:
// type JobSettingId = string & { __brand: "JobSettingId" };
// type NotificationSettingId = string & { __brand: "NotificationSettingId" };


// --- Basic Assertion ---
function assert(condition: boolean, message: string): void {
    if (!condition) {
        console.error(`Assertion failed: ${message}`);
        throw new Error(`Assertion failed: ${message}`);
    }
    console.log(`Assertion passed: ${message}`);
}

// --- Manual Mocks ---
let mockJobResultRepository_read_calls: any[][] = [];
let mockJobResultRepository_create_calls: any[][] = [];
const mockJobResultRepository: IJobResultRepository = {
    read: async (id: JobSettingId) => { mockJobResultRepository_read_calls.push([id]); return undefined; },
    create: async (jobResult: JobResult) => { mockJobResultRepository_create_calls.push([jobResult]); return jobResult; },
    // Implement other methods if needed by Job.ts, otherwise leave as stubs throwing errors
    readAll: async () => { throw new Error("readAll not mocked"); },
    update: async () => { throw new Error("update not mocked"); },
    delete: async () => { throw new Error("delete not mocked"); },
};

let mockNotificationSettingRepository_read_calls: any[][] = [];
let mockNotificationSettingRepository_readAll_calls: any[][] = [];
const mockNotificationSettingRepository: INotificationSettingRepository = {
    read: async (id: NotificationSettingId) => {
        mockNotificationSettingRepository_read_calls.push([id]);
        // Defined in test scenario
        return undefined;
    },
    readAll: async () => { mockNotificationSettingRepository_readAll_calls.push([]); return []; },
    create: async () => { throw new Error("create not mocked"); },
    update: async () => { throw new Error("update not mocked"); },
    delete: async () => { throw new Error("delete not mocked"); },
    generateId: () => 'mock-generated-id' as NotificationSettingId,
};

let mockFetcher_fetch_calls: any[][] = [];
const mockFetcher: IFetcher = {
    fetch: async () => { mockFetcher_fetch_calls.push([]); return 'Default fetched content'; },
};

let mockNotificationSender_send_calls: Map<string, any[][]> = new Map(); // Store calls per sender ID
const mockSendFunction = (senderId: string) => async (notification: Notification) => {
    if (!mockNotificationSender_send_calls.has(senderId)) {
        mockNotificationSender_send_calls.set(senderId, []);
    }
    mockNotificationSender_send_calls.get(senderId)!.push([notification]);
};

// --- Mock Factories Setup ---
RepositoryFactory.getJobResult = () => mockJobResultRepository;
RepositoryFactory.getNotificationSetting = () => mockNotificationSettingRepository;
FetcherFactory.get = (jobSetting: IJobSetting) => mockFetcher; // Simplified: returns the same mock fetcher

// Store original factory
const originalNotificationSenderFactoryGet = NotificationSenderFactory.get;
NotificationSenderFactory.get = (setting: INotificationSetting) => {
    // Return a new mock sender for each setting to track calls individually
    return {
        send: mockSendFunction(setting.id as string), // Assuming id is string or string-like
    };
};

function resetAllMocks() {
    mockJobResultRepository_read_calls = [];
    mockJobResultRepository_create_calls = [];
    mockNotificationSettingRepository_read_calls = [];
    mockNotificationSettingRepository_readAll_calls = [];
    mockFetcher_fetch_calls = [];
    mockNotificationSender_send_calls.clear();

    // Restore original factories if they were changed beyond simple assignment
    // NotificationSenderFactory.get = originalNotificationSenderFactoryGet; // if needed
}

// --- Test Suite ---
async function runJobTests() {
    console.log('--- Running Job.spec.ts ---');

    // **Scenario 1: Job with specific `notificationSettingIds`**
    async function testJobWithSpecificNotificationIds() {
        console.log('Running Scenario 1: Job with specific notificationSettingIds');
        resetAllMocks();

        const jobSetting: IJobSetting = {
            id: 'job-1' as JobSettingId, // Cast to opaque type
            name: 'Test Job 1',
            type: JobSettingType.XPATH,
            cronTime: '* * * * *',
            url: 'http://example.com',
            enabled: true,
            xpath: '//h1',
            notificationSettingIds: ['id1' as NotificationSettingId, 'id2' as NotificationSettingId],
        };

        const notificationSetting1: INotificationSetting = { id: 'id1' as NotificationSettingId, name: 'Setting 1', type: NotificationSettingType.SLACK, webhookUrl: 'url1' };
        const notificationSetting2: INotificationSetting = { id: 'id2' as NotificationSettingId, name: 'Setting 2', type: NotificationSettingType.SLACK, webhookUrl: 'url2' };

        // Configure mock behaviors for this specific test
        mockJobResultRepository.read = async (id: JobSettingId) => { mockJobResultRepository_read_calls.push([id]); return undefined; };
        mockFetcher.fetch = async () => { mockFetcher_fetch_calls.push([]); return 'New content'; };
        mockNotificationSettingRepository.read = async (id: NotificationSettingId) => {
            mockNotificationSettingRepository_read_calls.push([id]);
            if (id === 'id1') return notificationSetting1;
            if (id === 'id2') return notificationSetting2;
            return undefined;
        };

        const job = new Job(jobSetting);
        await job.run(); // This will trigger notifications

        assert(mockJobResultRepository_create_calls.length === 1, 'JobResultRepository.create should be called once');
        const createdJobResult = mockJobResultRepository_create_calls[0][0] as JobResult;
        assert(createdJobResult.result === 'New content', 'JobResult should contain fetched content');
        assert(createdJobResult.jobSettingId === jobSetting.id, 'JobResult linked to correct jobSettingId');

        assert(mockNotificationSettingRepository_read_calls.length === 2, 'NotificationSettingRepository.read should be called twice');
        assert(mockNotificationSettingRepository_read_calls[0][0] === 'id1', 'NotificationSettingRepository.read called with id1');
        assert(mockNotificationSettingRepository_read_calls[1][0] === 'id2', 'NotificationSettingRepository.read called with id2');

        assert(mockNotificationSender_send_calls.get('id1')?.length === 1, 'Sender for id1 send should be called once');
        assert(mockNotificationSender_send_calls.get('id2')?.length === 1, 'Sender for id2 send should be called once');
        assert(mockNotificationSettingRepository_readAll_calls.length === 0, 'NotificationSettingRepository.readAll should not be called');

        console.log('Scenario 1 Passed');
    }

    // --- Skeletons for Scenario 2 & 3 ---
    async function testJobWithEmptyNotificationIds() {
        console.log('Running Scenario 2: Job with empty notificationSettingIds');
        resetAllMocks();

        const jobSetting: IJobSetting = {
            id: 'job-2' as JobSettingId,
            name: 'Test Job 2',
            type: JobSettingType.XPATH,
            cronTime: '* * * * *',
            url: 'http://example.com',
            enabled: true,
            xpath: '//h1',
            notificationSettingIds: [], // Empty array
        };
        
        mockJobResultRepository.read = async (id: JobSettingId) => { mockJobResultRepository_read_calls.push([id]); return undefined; };
        mockFetcher.fetch = async () => { mockFetcher_fetch_calls.push([]); return 'New content for job 2'; };

        const job = new Job(jobSetting);
        await job.run();

        assert(mockJobResultRepository_create_calls.length === 1, 'S2: JobResultRepository.create should be called once');
        // Crucially, check no notifications were attempted
        assert(mockNotificationSettingRepository_read_calls.length === 0, 'S2: NotificationSettingRepository.read should NOT be called');
        assert(mockNotificationSender_send_calls.size === 0, 'S2: No notification sender should have been called');
        console.log('Scenario 2 Passed');
    }

    async function testJobWithNullNotificationIds() {
        console.log('Running Scenario 3: Job with undefined/null notificationSettingIds');
        resetAllMocks();

        const jobSettingUndefined: IJobSetting = {
            id: 'job-3-undef' as JobSettingId,
            name: 'Test Job 3 Undefined',
            type: JobSettingType.XPATH,
            cronTime: '* * * * *',
            url: 'http://example.com',
            enabled: true,
            xpath: '//h1',
            notificationSettingIds: undefined, // Undefined
        };
        
        mockJobResultRepository.read = async (id: JobSettingId) => { mockJobResultRepository_read_calls.push([id]); return undefined; };
        mockFetcher.fetch = async () => { mockFetcher_fetch_calls.push([]); return 'New content for job 3'; };

        const jobUndefined = new Job(jobSettingUndefined);
        await jobUndefined.run();

        assert(mockJobResultRepository_create_calls.length === 1, 'S3 (undefined): JobResultRepository.create should be called once');
        assert(mockNotificationSettingRepository_read_calls.length === 0, 'S3 (undefined): NotificationSettingRepository.read should NOT be called');
        assert(mockNotificationSender_send_calls.size === 0, 'S3 (undefined): No notification sender should have been called');
        
        // Test with null
        resetAllMocks();
        const jobSettingNull: IJobSetting = { 
            id: 'job-3-null' as JobSettingId, 
            name: 'Test Job 3 Null',
            type: JobSettingType.XPATH,
            cronTime: '* * * * *',
            url: 'http://example.com',
            enabled: true,
            xpath: '//h1',
            // @ts-ignore // Allow null assignment for testing this specific scenario
            notificationSettingIds: null, 
        };
        mockJobResultRepository.read = async (id: JobSettingId) => { mockJobResultRepository_read_calls.push([id]); return undefined; };
        mockFetcher.fetch = async () => { mockFetcher_fetch_calls.push([]); return 'New content for job 3 null'; };
        const jobNull = new Job(jobSettingNull);
        await jobNull.run();
        assert(mockJobResultRepository_create_calls.length === 1, 'S3 (null): JobResultRepository.create should be called once');
        assert(mockNotificationSettingRepository_read_calls.length === 0, 'S3 (null): NotificationSettingRepository.read should NOT be called');
        assert(mockNotificationSender_send_calls.size === 0, 'S3 (null): No notification sender should have been called');

        console.log('Scenario 3 Passed');
    }


    // Run tests
    try {
        await testJobWithSpecificNotificationIds();
        await testJobWithEmptyNotificationIds();
        await testJobWithNullNotificationIds();
        console.log('--- Job.spec.ts All Tests Passed ---');
    } catch (e: any) {
        console.error('--- Job.spec.ts Tests Failed ---');
        console.error(e.message);
        // For more detailed stack trace if needed: console.error(e.stack);
    } finally {
        // Restore any global mocks if necessary
        NotificationSenderFactory.get = originalNotificationSenderFactoryGet;
    }
}

// Allow running this file directly: `ts-node src/core/jobs/Job.spec.ts`
// Ensure ts-node is a dev dependency or installed globally if you want to run this way.
// Add `import 'ts-node/register'` at the top if running plain `node Job.spec.ts` after tsc.
if (require.main === module) {
    runJobTests();
}

export {}; // Make this a module
