// Philippine locations prioritizing Cavite and Laguna
export const locations = [
    { id: 1, name: 'Cavite', region: 'CALABARZON' },
    { id: 2, name: 'Laguna', region: 'CALABARZON' },
    { id: 3, name: 'Quezon City', region: 'NCR' },
    { id: 4, name: 'Manila', region: 'NCR' },
    { id: 5, name: 'Makati City', region: 'NCR' },
    { id: 6, name: 'Taguig City', region: 'NCR' },
    { id: 7, name: 'Pasig City', region: 'NCR' },
    { id: 8, name: 'Cebu City', region: 'Visayas' },
    { id: 9, name: 'Davao City', region: 'Mindanao' },
    { id: 10, name: 'Remote', region: 'Anywhere' },
];

export const getCaviteAndLagunaJobs = (allJobs) => {
    return allJobs.filter(job => 
        job?.company?.location?.includes('Cavite') || 
        job?.company?.location?.includes('Laguna')
    );
};
