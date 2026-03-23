import express from 'express';
import Company from '../models/Company.js';
import Job from '../models/Job.js';

const router = express.Router();

// Seed Cavite and Laguna data
router.post('/seed-cavite-laguna', async (req, res) => {
    try {
        console.log('🌱 Starting to seed Cavite and Laguna data...');

        // Check if data already exists
        const existingJobCount = await Job.count();
        if (existingJobCount > 0) {
            return res.json({
                success: false,
                message: `Data already exists! Found ${existingJobCount} jobs. To reseed, please clear the database first.`
            });
        }

        // Only 2 companies
        const companies = [
            {
                companyName: 'Cavite Digital Solutions',
                email: 'jobs@cavitedigital.com',
                phone: '09173456789',
                location: 'Silang, Cavite',
                description: 'Digital transformation specialists',
                website: 'https://cavitedigital.com'
            },
            {
                companyName: 'Laguna Tech Park',
                email: 'hr@lagunatechpark.com',
                phone: '09181234567',
                location: 'Sta. Rosa, Laguna',
                description: 'Premier tech park and innovation center',
                website: 'https://lagunatechpark.com'
            }
        ];

        // Create companies
        const createdCompanies = await Promise.all(
            companies.map(comp => 
                Company.findOrCreate({ 
                    where: { email: comp.email },
                    defaults: comp 
                })
            )
        );

        const allCompanies = createdCompanies.map(([company]) => company);
        console.log(`✅ Created/Found ${allCompanies.length} companies`);

        // Exactly 10 jobs
        const jobTemplates = [
            {
                jobTitle: 'Senior Software Developer',
                type: 'Full-Time',
                education: "Bachelor's Degree in CS/IT",
                experience: '3-5 years',
                description: 'We are looking for an experienced software developer to join our team.',
                responsibilities: JSON.stringify(['Develop web applications', 'Code review', 'Team collaboration', 'System architecture'])
            },
            {
                jobTitle: 'Junior Web Developer',
                type: 'Internship',
                education: "Bachelor's Degree (3rd year)",
                experience: '0-1 year',
                description: 'Great opportunity for fresh graduates to learn and grow.',
                responsibilities: JSON.stringify(['Assist in web development', 'Testing', 'Learning opportunities', 'Bug fixes'])
            },
            {
                jobTitle: 'QA Engineer',
                type: 'Full-Time',
                education: "Bachelor's Degree in IT",
                experience: '1-3 years',
                description: 'Quality assurance specialist needed for product testing.',
                responsibilities: JSON.stringify(['Automated testing', 'Bug reporting', 'Test case creation', 'Performance testing'])
            },
            {
                jobTitle: 'Project Manager',
                type: 'Full-Time',
                education: "Bachelor's Degree in any field",
                experience: '2-4 years',
                description: 'Lead projects and manage development teams.',
                responsibilities: JSON.stringify(['Project planning', 'Team management', 'Stakeholder communication', 'Risk management'])
            },
            {
                jobTitle: 'UI/UX Designer',
                type: 'Part-Time',
                education: 'Certificate or Degree in Design',
                experience: '1-2 years',
                description: 'Create beautiful and user-friendly interfaces.',
                responsibilities: JSON.stringify(['UI design', 'User research', 'Prototyping', 'Design systems'])
            },
            {
                jobTitle: 'Data Analyst',
                type: 'Full-Time',
                education: "Bachelor's Degree in Data Science/IT",
                experience: '2-3 years',
                description: 'Analyze data and provide insights for business decisions.',
                responsibilities: JSON.stringify(['Data analysis', 'Report generation', 'Dashboard creation', 'SQL queries'])
            },
            {
                jobTitle: 'DevOps Engineer',
                type: 'Full-Time',
                education: "Bachelor's Degree in IT/CS",
                experience: '2-3 years',
                description: 'Manage infrastructure and deployment pipelines.',
                responsibilities: JSON.stringify(['Infrastructure management', 'CI/CD pipelines', 'Cloud deployment', 'Monitoring'])
            },
            {
                jobTitle: 'Business Analyst',
                type: 'Full-Time',
                education: "Bachelor's Degree in Business/IT",
                experience: '1-2 years',
                description: 'Analyze business requirements and translate to technical solutions.',
                responsibilities: JSON.stringify(['Requirements gathering', 'Documentation', 'Stakeholder management', 'Testing coordination'])
            },
            {
                jobTitle: 'Backend Developer',
                type: 'Full-Time',
                education: "Bachelor's Degree in CS/IT",
                experience: '2-4 years',
                description: 'Build robust backend systems and APIs.',
                responsibilities: JSON.stringify(['API development', 'Database design', 'Server optimization', 'Security implementation'])
            },
            {
                jobTitle: 'Frontend Developer',
                type: 'Full-Time',
                education: "Bachelor's Degree in CS/IT",
                experience: '2-3 years',
                description: 'Create responsive and interactive web interfaces.',
                responsibilities: JSON.stringify(['UI implementation', 'React/Vue development', 'Performance optimization', 'Cross-browser testing'])
            }
        ];

        // Create exactly 10 jobs (5 per company)
        let jobsCreated = 0;
        for (let i = 0; i < jobTemplates.length; i++) {
            const company = allCompanies[i % allCompanies.length];
            
            await Job.create({
                ...jobTemplates[i],
                companyId: company.id,
                postedAt: new Date(),
                status: 'open'
            });
            jobsCreated++;
        }

        console.log(`✅ Created exactly ${jobsCreated} jobs`);

        res.json({
            success: true,
            message: '✅ Data seeded successfully! Fixed to 10 jobs across 2 companies.',
            companies: allCompanies.length,
            jobs: jobsCreated
        });

    } catch (error) {
        console.error('❌ Error seeding data:', error);
        res.status(500).json({
            success: false,
            message: 'Error seeding data',
            error: error.message
        });
    }
});

export default router;
