import { sequelize, connectToDatabase } from './config/sequelize.js';
import Companies from './models/Company.js';
import { Jobs } from './models/index.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const seedCompaniesAndJobs = async () => {
    try {
        await connectToDatabase();

        // 20 Real CALABARZON Companies
        const companiesData = [
            { companyName: 'Nissan Manufacturing Corp', industry: 'manufacturing', location: 'Santa Rosa, Laguna' },
            { companyName: 'Nestlé Philippines', industry: 'manufacturing', location: 'Cavite City, Cavite' },
            { companyName: 'San Miguel Corporation', industry: 'manufacturing', location: 'Laguna, Laguna' },
            { companyName: 'Jollibee Foods Corporation', industry: 'hospitality', location: 'Pasig Adjacent, Cavite' },
            { companyName: 'TechNova Solutions', industry: 'it', location: 'Cavite City, Cavite' },
            { companyName: 'BDO Unibank', industry: 'finance', location: 'Santa Rosa, Laguna' },
            { companyName: 'Medicard Philippines', industry: 'healthcare', location: 'Laguna, Laguna' },
            { companyName: 'Landbank of the Philippines', industry: 'finance', location: 'Cabuyao, Laguna' },
            { companyName: 'De La Salle University', industry: 'education', location: 'Dasmariñas, Cavite' },
            { companyName: 'Robinsons Land Corporation', industry: 'real_estate', location: 'Cavite City, Cavite' },
            { companyName: 'Purina PetCare', industry: 'manufacturing', location: 'Santa Rosa, Laguna' },
            { companyName: 'Coca-Cola FEMSA', industry: 'manufacturing', location: 'Laguna, Laguna' },
            { companyName: 'Epson Philippines', industry: 'it', location: 'Sta. Rosa, Laguna' },
            { companyName: 'GCash (Globe Fintech)', industry: 'finance', location: 'Cavite City, Cavite' },
            { companyName: 'AXA Philippines', industry: 'finance', location: 'Laguna, Laguna' },
            { companyName: 'HP Philippines', industry: 'it', location: 'Santa Rosa, Laguna' },
            { companyName: 'Allianz PNB Life', industry: 'finance', location: 'Cavite City, Cavite' },
            { companyName: 'CDO Foodsphere', industry: 'manufacturing', location: 'Rosario, Cavite' },
            { companyName: 'Universal Robina Corporation', industry: 'manufacturing', location: 'Laguna, Laguna' },
            { companyName: 'Convergys (TTEC)', industry: 'it', location: 'Santa Rosa, Laguna' }
        ];

        // Check and create companies
        let companies = [];
        for (const companyData of companiesData) {
            const existing = await Companies.findOne({ 
                where: { companyName: companyData.companyName } 
            });
            
            if (!existing) {
                const company = await Companies.create(companyData);
                companies.push(company);
            } else {
                companies.push(existing);
            }
        }

        console.log(`✅ ${companies.length} companies ready`);

        // 20 Real Jobs
        const jobsData = [
            { jobTitle: 'Software Engineer', companyId: companies[4]?.id, type: 'Full-Time', education: 'Bachelor\'s Degree in CS', experience: '2-5 years', description: 'Develop scalable software solutions', responsibilities: ['Code development', 'Code review', 'Testing'] },
            { jobTitle: 'Mechanical Engineer', companyId: companies[0]?.id, type: 'Full-Time', education: 'Bachelor\'s Degree in ME', experience: '3+ years', description: 'Design and develop automotive components', responsibilities: ['Design', 'Testing', 'Documentation'] },
            { jobTitle: 'Production Manager', companyId: companies[1]?.id, type: 'Full-Time', education: 'Bachelor\'s Degree', experience: '5+ years', description: 'Oversee production operations', responsibilities: ['Manage team', 'Quality control', 'Production planning'] },
            { jobTitle: 'IT Support Specialist', companyId: companies[5]?.id, type: 'Full-Time', education: 'Associate Degree or 2+ years experience', experience: '1-3 years', description: 'Provide technical support to users', responsibilities: ['Troubleshooting', 'Hardware setup', 'User training'] },
            { jobTitle: 'Registered Nurse', companyId: companies[6]?.id, type: 'Full-Time', education: 'Bachelor of Science in Nursing', experience: '1+ years', description: 'Patient care and nursing duties', responsibilities: ['Patient care', 'Record keeping', 'Medication administration'] },
            { jobTitle: 'Financial Analyst', companyId: companies[5]?.id, type: 'Full-Time', education: 'Bachelor\'s Degree in Finance', experience: '2-4 years', description: 'Analyze financial data and trends', responsibilities: ['Data analysis', 'Reporting', 'Forecasting'] },
            { jobTitle: 'Marketing Manager', companyId: companies[2]?.id, type: 'Full-Time', education: 'Bachelor\'s Degree in Marketing', experience: '3-5 years', description: 'Develop and execute marketing strategies', responsibilities: ['Campaign management', 'Team leadership', 'Budget planning'] },
            { jobTitle: 'Quality Assurance Engineer', companyId: companies[4]?.id, type: 'Full-Time', education: 'Bachelor\'s Degree', experience: '2-3 years', description: 'Ensure product quality standards', responsibilities: ['Testing', 'Documentation', 'Bug reporting'] },
            { jobTitle: 'Human Resources Officer', companyId: companies[7]?.id, type: 'Full-Time', education: 'Bachelor\'s Degree in HR', experience: '2-3 years', description: 'Manage recruitment and employee relations', responsibilities: ['Recruitment', 'Onboarding', 'Payroll administration'] },
            { jobTitle: 'Sales Executive', companyId: companies[2]?.id, type: 'Full-Time', education: 'Bachelor\'s Degree', experience: '1-3 years', description: 'Generate sales and manage client relationships', responsibilities: ['Client acquisition', 'Sales reporting', 'Negotiation'] },
            { jobTitle: 'Data Analyst', companyId: companies[15]?.id, type: 'Full-Time', education: 'Bachelor\'s Degree in Data Science', experience: '2-4 years', description: 'Analyze and visualize business data', responsibilities: ['Data analysis', 'Dashboard creation', 'Report generation'] },
            { jobTitle: 'Supply Chain Coordinator', companyId: companies[10]?.id, type: 'Full-Time', education: 'Bachelor\'s Degree', experience: '2-3 years', description: 'Coordinate supply chain operations', responsibilities: ['Inventory management', 'Vendor coordination', 'Logistics'] },
            { jobTitle: 'Customer Service Representative', companyId: companies[12]?.id, type: 'Full-Time', education: 'High School Diploma', experience: '1+ years', description: 'Provide excellent customer support', responsibilities: ['Customer support', 'Issue resolution', 'Documentation'] },
            { jobTitle: 'Junior Developer Internship', companyId: companies[4]?.id, type: 'Internship', education: 'Currently studying CS', experience: 'None', description: 'Learn and assist in software development', responsibilities: ['Coding', 'Learning', 'Testing'] },
            { jobTitle: 'Project Manager', companyId: companies[0]?.id, type: 'Full-Time', education: 'Bachelor\'s Degree', experience: '4-6 years', description: 'Manage projects from initiation to completion', responsibilities: ['Project planning', 'Team coordination', 'Risk management'] },
            { jobTitle: 'Accountant', companyId: companies[7]?.id, type: 'Full-Time', education: 'Bachelor\'s Degree in Accounting', experience: '2-4 years', description: 'Manage accounting operations', responsibilities: ['Bookkeeping', 'Tax preparation', 'Financial reporting'] },
            { jobTitle: 'System Administrator', companyId: companies[15]?.id, type: 'Full-Time', education: 'Associate Degree or 2+ years experience', experience: '2-3 years', description: 'Manage IT systems and infrastructure', responsibilities: ['System maintenance', 'Network management', 'Security'] },
            { jobTitle: 'Operations Officer', companyId: companies[10]?.id, type: 'Full-Time', education: 'Bachelor\'s Degree', experience: '3-5 years', description: 'Oversee daily operations', responsibilities: ['Process improvement', 'Team management', 'Compliance'] },
            { jobTitle: 'Graphic Designer', companyId: companies[14]?.id, type: 'Contract', education: 'Associate Degree or Portfolio', experience: '1-3 years', description: 'Create visual designs for marketing materials', responsibilities: ['Design creation', 'Client collaboration', 'Revisions'] },
            { jobTitle: 'Business Development Manager', companyId: companies[5]?.id, type: 'Full-Time', education: 'Bachelor\'s Degree', experience: '3-5 years', description: 'Drive business growth and partnerships', responsibilities: ['Partnership development', 'Market research', 'Strategy'] }
        ];

        // Check and create jobs
        let jobCount = 0;
        for (const jobData of jobsData) {
            const existing = await Jobs.findOne({ 
                where: { 
                    jobTitle: jobData.jobTitle,
                    companyId: jobData.companyId
                }
            });
            
            if (!existing && jobData.companyId) {
                await Jobs.create(jobData);
                jobCount++;
            }
        }

        console.log(`✅ ${jobCount} jobs created`);

        console.log('\n╔═══════════════════════════════════════════╗');
        console.log('║     🎉 DATABASE SEEDING COMPLETE 🎉       ║');
        console.log('╠═══════════════════════════════════════════╣');
        console.log(`║  ✅ ${companies.length} Companies added               ║`);
        console.log(`║  ✅ ${jobCount} Jobs added                    ║`);
        console.log('║  📍 All from CALABARZON region            ║');
        console.log('╚═══════════════════════════════════════════╝\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

seedCompaniesAndJobs();
