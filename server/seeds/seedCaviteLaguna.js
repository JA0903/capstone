import { sequelize } from '../config/sequelize.js';
import Company from '../models/Company.js';
import Job from '../models/Job.js';
import Admin from '../models/Admin.js';
import Users from '../models/User.js';
import bcrypt from 'bcrypt';

const seedCaviteAndLaguna = async () => {
    try {
        console.log('🌱 Seeding Cavite and Laguna companies and jobs...');

        // Seed default admin if not exists
        const existingAdmin = await Admin.findOne({ where: { email: 'admin@capstone.com' } });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('Admin@12345', 10);
            await Admin.create({
                fullname: 'System Administrator',
                email: 'admin@capstone.com',
                password: hashedPassword,
                role: 'HR Manager'
            });
            console.log('✅ Created default admin (admin@capstone.com)');
        } else {
            console.log('✅ Admin already exists');
        }

        // Seed default client user if not exists
        const existingClient = await Users.findOne({ where: { email: 'client@capstone.com' } });
        if (!existingClient) {
            const hashedClientPassword = await bcrypt.hash('Client@12345', 10);
            await Users.create({
                fullname: 'Test Client',
                email: 'client@capstone.com',
                password: hashedClientPassword,
                phone: '+1234567890',
                isVerified: 'yes',
                savedJobs: []
            });
            console.log('✅ Created default client user (client@capstone.com)');
        } else {
            console.log('✅ Client user already exists');
        }

        // Check if jobs already exist to avoid duplicates
        const existingJobCount = await Job.count();
        if (existingJobCount > 0) {
            console.log(`✅ Jobs already exist (${existingJobCount} found). Skipping seed.`);
            return;
        }

        // Seed only 2 companies
        const companies = await Company.bulkCreate([
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
        ], { ignoreDuplicates: true });

        // Get companies for job creation
        const allCompanies = await Company.findAll();
        console.log(`✅ Found ${allCompanies.length} companies`);

        // Exactly 10 unique jobs
        const jobsData = [
            {
                jobTitle: 'Senior Software Developer',
                type: 'Full-Time',
                education: "Bachelor's Degree in CS/IT",
                experience: '3-5 years',
                description: 'We are looking for an experienced software developer to join our team.',
                responsibilities: ['Develop web applications', 'Code review', 'Team collaboration', 'System architecture']
            },
            {
                jobTitle: 'Junior Web Developer',
                type: 'Internship',
                education: "Bachelor's Degree (3rd year)",
                experience: '0-1 year',
                description: 'Great opportunity for fresh graduates to learn and grow.',
                responsibilities: ['Assist in web development', 'Testing', 'Learning opportunities', 'Bug fixes']
            },
            {
                jobTitle: 'QA Engineer',
                type: 'Full-Time',
                education: "Bachelor's Degree in IT",
                experience: '1-3 years',
                description: 'Quality assurance specialist needed for product testing.',
                responsibilities: ['Automated testing', 'Bug reporting', 'Test case creation', 'Performance testing']
            },
            {
                jobTitle: 'Project Manager',
                type: 'Full-Time',
                education: "Bachelor's Degree in any field",
                experience: '2-4 years',
                description: 'Lead projects and manage development teams.',
                responsibilities: ['Project planning', 'Team management', 'Stakeholder communication', 'Risk management']
            },
            {
                jobTitle: 'UI/UX Designer',
                type: 'Part-Time',
                education: 'Certificate or Degree in Design',
                experience: '1-2 years',
                description: 'Create beautiful and user-friendly interfaces.',
                responsibilities: ['UI design', 'User research', 'Prototyping', 'Design systems']
            },
            {
                jobTitle: 'Data Analyst',
                type: 'Full-Time',
                education: "Bachelor's Degree in Data Science/IT",
                experience: '2-3 years',
                description: 'Analyze data and provide insights for business decisions.',
                responsibilities: ['Data analysis', 'Report generation', 'Dashboard creation', 'SQL queries']
            },
            {
                jobTitle: 'DevOps Engineer',
                type: 'Full-Time',
                education: "Bachelor's Degree in IT/CS",
                experience: '2-3 years',
                description: 'Manage infrastructure and deployment pipelines.',
                responsibilities: ['Infrastructure management', 'CI/CD pipelines', 'Cloud deployment', 'Monitoring']
            },
            {
                jobTitle: 'Business Analyst',
                type: 'Full-Time',
                education: "Bachelor's Degree in Business/IT",
                experience: '1-2 years',
                description: 'Analyze business requirements and translate to technical solutions.',
                responsibilities: ['Requirements gathering', 'Documentation', 'Stakeholder management', 'Testing coordination']
            },
            {
                jobTitle: 'Backend Developer',
                type: 'Full-Time',
                education: "Bachelor's Degree in CS/IT",
                experience: '2-4 years',
                description: 'Build robust backend systems and APIs.',
                responsibilities: ['API development', 'Database design', 'Server optimization', 'Security implementation']
            },
            {
                jobTitle: 'Frontend Developer',
                type: 'Full-Time',
                education: "Bachelor's Degree in CS/IT",
                experience: '2-3 years',
                description: 'Create responsive and interactive web interfaces.',
                responsibilities: ['UI implementation', 'React/Vue development', 'Performance optimization', 'Cross-browser testing']
            }
        ];

        // Create exactly 10 jobs (5 per company)
        let jobsCreated = 0;
        for (let i = 0; i < jobsData.length; i++) {
            const company = allCompanies[i % allCompanies.length]; // Alternate between companies
            
            await Job.create({
                ...jobsData[i],
                companyId: company.id,
                postedAt: new Date(),
                status: 'open'
            });
            jobsCreated++;
        }

        console.log(`✅ Created exactly ${jobsCreated} jobs across ${allCompanies.length} companies`);
        console.log('🎉 Seeding completed successfully!');

    } catch (error) {
        console.error('❌ Error seeding data:', error.message);
    }
};

export default seedCaviteAndLaguna;
