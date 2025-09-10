const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./model/user');
const Disease = require('./model/disease');
const Drug = require('./model/drug');
const Animal = require('./model/animal');

async function seed() {
  await mongoose.connect(process.env.MONGO_URL);

  // 1. Add Users
  const [farmer, vet] = await User.create([
    { fullName: 'Ram Kumar', mobileNo: '9999999999', password: 'farmer123', role: 'farmer' },
    { fullName: 'Dr. Shyam', mobileNo: '8888888888', password: 'vet123', role: 'vet' }
  ]);

  // 2. Add Diseases
  const [fever, mastitis] = await Disease.create([
    { name: 'Fever', symptoms: ['high temperature', 'lethargy'] },
    { name: 'Mastitis', symptoms: ['swollen udder', 'milk change'] }
  ]);

  // 3. Add Drugs
  const [amox, acyclo] = await Drug.create([
    { name: 'Amoxicillin', category: 'Antibiotic', dosageForms: 'Tablet', withdrawalPeriod: '7 days' },
    { name: 'Acyclovir', category: 'Antiviral', dosageForms: 'Injection', withdrawalPeriod: '5 days' }
  ]);

  // 4. Add Animal with treatments
  await Animal.create({
    animalId: 'cow001',
    species: 'cow',
    age: 5,
    weight: 350,
    disease: fever._id,
    owner: farmer._id,
    treatments: [
      {
        vet: vet._id,
        medicines: [
          { name: amox._id, morningDosage: '1', afternoonDosage: '1', nightDosage: '1', duration: '5 days' }
        ],
        effectiveness: 'successful',
        status: 'completed',
        reason: 'Fever treatment',
        notes: 'Recovered well'
      },
      {
        vet: vet._id,
        medicines: [
          { name: acyclo._id, morningDosage: '1', afternoonDosage: '1', nightDosage: '1', duration: '3 days' }
        ],
        effectiveness: 'unsuccessful',
        status: 'completed',
        reason: 'Viral infection',
        notes: 'No improvement'
      }
    ]
  });

  console.log('Sample data added!');
  mongoose.disconnect();
}

seed();