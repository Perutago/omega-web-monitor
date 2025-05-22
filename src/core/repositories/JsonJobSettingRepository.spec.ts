import fs from 'fs';
import JsonJobSettingRepository from './JsonJobSettingRepository';
import IJobSetting, { JobSettingId, JobSettingType } from '../entities/IJobSetting';
import { NotificationSettingId } from '../entities/INotificationSetting'; // Assuming NotificationSettingId is exported
import { Brand } from '../Types'; // Assuming Brand is exported
import { UUID } from 'crypto'; // For type compatibility if Brand/JobSettingId use it

// --- Minimalist Brand and Id Types (if not properly imported) ---
// type Brand<K, T> = K & { __brand: T }; // Already in Job.spec.ts, but good for standalone
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

// --- Mock 'fs' module ---
let mockFsStore: { [key: string]: string } = {}; // In-memory store for file content
let fs_readFileSync_calls: any[][] = [];
let fs_writeFileSync_calls: any[][] = [];
let fs_existsSync_calls: any[][] = []; // To mock fs.existsSync

const originalFsReadFileSync = fs.readFileSync;
const originalFsWriteFileSync = fs.writeFileSync;
const originalFsExistsSync = fs.existsSync; // Store original existsSync

fs.readFileSync = (path: any, options?: any): Buffer | string => {
    fs_readFileSync_calls.push([path, options]);
    if (mockFsStore[path as string]) {
        return Buffer.from(mockFsStore[path as string]);
    }
    // Simulate file not found error if path is specific (like the repo's db file)
    // and not a generic path that might be read by other parts of the test setup.
    // For this test, we assume the file path used by JsonJobSettingRepository exists or is created.
    // If it should throw ENOENT, then:
    // const error: any = new Error(`ENOENT: no such file or directory, open '${path}'`);
    // error.code = 'ENOENT';
    // throw error;
    return Buffer.from('[]'); // Default to empty array if not found, typical for these JSON stores
};

fs.writeFileSync = (path: any, data: any, options?: any): void => {
    fs_writeFileSync_calls.push([path, data, options]);
    mockFsStore[path as string] = data as string;
};

fs.existsSync = (path: any): boolean => {
    fs_existsSync_calls.push([path]);
    return path in mockFsStore; // Or always true/false depending on test needs
};


function resetFsMocks() {
    mockFsStore = {};
    fs_readFileSync_calls = [];
    fs_writeFileSync_calls = [];
    fs_existsSync_calls = [];
}

// --- Test Suite ---
async function runJsonJobSettingRepositoryTests() {
    console.log('--- Running JsonJobSettingRepository.spec.ts ---');
    const repository = new JsonJobSettingRepository(); // Uses the mocked 'fs'

    // **Scenario 4: Saving and reading `notificationSettingIds`**
    async function testSaveAndReadWithNotificationIds() {
        console.log('Running Scenario 4: Saving and reading with notificationSettingIds');
        resetFsMocks();
        // Mock existsSync to simulate file initially not existing, then existing after write
        fs.existsSync = (path: any): boolean => fs_existsSync_calls.push([path]) && (path in mockFsStore);


        const jobSettingWithIds: IJobSetting = {
            id: repository.generateId(), // Use repository's ID generation
            name: 'Job With IDs',
            type: JobSettingType.REGEX,
            cronTime: '0 0 * * *',
            url: 'http://example.com/withids',
            enabled: true,
            regex: 'data',
            notificationSettingIds: ['setting1' as NotificationSettingId, 'setting2' as NotificationSettingId],
        };

        // Create
        await repository.create(jobSettingWithIds);
        assert(fs_writeFileSync_calls.length === 1, 'S4 Create: fs.writeFileSync should be called once');

        // Read
        const retrievedJob = await repository.read(jobSettingWithIds.id);
        assert(retrievedJob !== undefined, 'S4 Read: Retrieved job should not be undefined');
        assert(JSON.stringify(retrievedJob?.notificationSettingIds) === JSON.stringify(jobSettingWithIds.notificationSettingIds), 
               'S4 Read: notificationSettingIds should match');
        assert(retrievedJob?.name === jobSettingWithIds.name, 'S4 Read: Name should match');

        // Update
        const updatedJobSetting = { ...retrievedJob!, notificationSettingIds: ['setting3' as NotificationSettingId] };
        await repository.update(updatedJobSetting);
        assert(fs_writeFileSync_calls.length === 2, 'S4 Update: fs.writeFileSync should be called again');
        
        const retrievedAfterUpdate = await repository.read(updatedJobSetting.id);
        assert(retrievedAfterUpdate !== undefined, 'S4 Update: Retrieved job should not be undefined after update');
        assert(JSON.stringify(retrievedAfterUpdate?.notificationSettingIds) === JSON.stringify(updatedJobSetting.notificationSettingIds), 
               'S4 Update: notificationSettingIds should be updated');
        
        console.log('Scenario 4 Passed');
    }

    // **Scenario 5: Saving and reading a job setting without `notificationSettingIds`**
    async function testSaveAndReadWithoutNotificationIds() {
        console.log('Running Scenario 5: Saving and reading without notificationSettingIds');
        resetFsMocks();
        fs.existsSync = (path: any): boolean => fs_existsSync_calls.push([path]) && (path in mockFsStore);

        const jobSettingWithoutIds: IJobSetting = {
            id: repository.generateId(),
            name: 'Job Without IDs',
            type: JobSettingType.XPATH,
            cronTime: '0 1 * * *',
            url: 'http://example.com/withoutids',
            enabled: false,
            xpath: '//p',
            // notificationSettingIds is intentionally omitted
        };

        // Create
        await repository.create(jobSettingWithoutIds);
        assert(fs_writeFileSync_calls.length === 1, 'S5 Create: fs.writeFileSync should be called once');

        // Read
        const retrievedJob = await repository.read(jobSettingWithoutIds.id);
        assert(retrievedJob !== undefined, 'S5 Read: Retrieved job should not be undefined');
        assert(retrievedJob?.notificationSettingIds === undefined || retrievedJob?.notificationSettingIds === null, 
               'S5 Read: notificationSettingIds should be undefined or null');
        assert(retrievedJob?.name === jobSettingWithoutIds.name, 'S5 Read: Name should match');
        
        // Update (e.g. change name, still no notificationSettingIds)
        const updatedJobSetting = { ...retrievedJob!, name: "Updated Job Without IDs" };
        await repository.update(updatedJobSetting);
        assert(fs_writeFileSync_calls.length === 2, 'S5 Update: fs.writeFileSync should be called again');

        const retrievedAfterUpdate = await repository.read(updatedJobSetting.id);
        assert(retrievedAfterUpdate !== undefined, 'S5 Update: Retrieved job should not be undefined after update');
        assert(retrievedAfterUpdate?.notificationSettingIds === undefined || retrievedAfterUpdate?.notificationSettingIds === null, 
               'S5 Update: notificationSettingIds should still be undefined or null');
        assert(retrievedAfterUpdate?.name === "Updated Job Without IDs", 'S5 Update: Name should be updated');

        console.log('Scenario 5 Passed');
    }

    // Run tests
    try {
        await testSaveAndReadWithNotificationIds();
        await testSaveAndReadWithoutNotificationIds();
        console.log('--- JsonJobSettingRepository.spec.ts All Tests Passed ---');
    } catch (e: any) {
        console.error('--- JsonJobSettingRepository.spec.ts Tests Failed ---');
        console.error(e.message);
    } finally {
        // Restore original fs functions
        fs.readFileSync = originalFsReadFileSync;
        fs.writeFileSync = originalFsWriteFileSync;
        fs.existsSync = originalFsExistsSync;
    }
}

// Allow running this file directly
if (require.main === module) {
    runJsonJobSettingRepositoryTests();
}

export {}; // Make this a module
