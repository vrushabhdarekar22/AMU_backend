const PDFDocument = require('pdfkit');
const Animal = require('../../model/animal'); // adjust if folder is models/Animal.js

const generateAnimalReport = async (req, res) => {
  try {
    const { animalId } = req.params;

    // Fetch animal with all required populations
    const animal = await Animal.findById(animalId)
      .populate('owner')
      .populate('treatments.vet')
      .populate('treatments.medicines.name');

    if (!animal) return res.status(404).json({ message: 'Animal not found' });

    // Create PDF
    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${animal.animalId}_report.pdf`
    );
    doc.pipe(res);

    // Header
    doc.fontSize(18).text(`Animal Report: ${animal.animalId}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12)
      .text(`Species: ${animal.species}`)
      .text(`Age: ${animal.age || '-'}`)
      .text(`Weight: ${animal.weight || '-'}`)
      .text(`Owner: ${animal.owner?.fullName || '-'}`);
    doc.moveDown();

    // Table setup
    const tableTop = doc.y;
    const colPositions = {
      drug: 50,
      vet: 120,
      start: 200,
      end: 260,
      morning: 320,
      afternoon: 380,
      night: 440,
      duration: 500,
      waiting: 550,
      status: 600,
      effectiveness: 650,
      notes: 710,
      reason: 770
    };

    const addTableHeader = (yPos) => {
      doc.fontSize(10)
        .text('Drug Name', colPositions.drug, yPos)
        .text('Vet', colPositions.vet, yPos)
        .text('Start', colPositions.start, yPos)
        .text('End', colPositions.end, yPos)
        .text('Morning', colPositions.morning, yPos)
        .text('Afternoon', colPositions.afternoon, yPos)
        .text('Night', colPositions.night, yPos)
        .text('Duration', colPositions.duration, yPos)
        .text('Waiting', colPositions.waiting, yPos)
        .text('Status', colPositions.status, yPos)
        .text('Effectiveness', colPositions.effectiveness, yPos)
        .text('Notes', colPositions.notes, yPos)
        .text('Reason', colPositions.reason, yPos);
    };

    addTableHeader(tableTop);
    let y = tableTop + 20;

    // Table content
    animal.treatments.forEach((treatment) => {
      treatment.medicines.forEach((med) => {
        doc.fontSize(9)
          .text(med.name?.name || '-', colPositions.drug, y)
          .text(treatment.vet?.fullName || '-', colPositions.vet, y)
          .text(treatment.startDate?.toDateString() || '-', colPositions.start, y)
          .text(treatment.endDate?.toDateString() || '-', colPositions.end, y)
          .text(med.morningDosage || '-', colPositions.morning, y)
          .text(med.afternoonDosage || '-', colPositions.afternoon, y)
          .text(med.nightDosage || '-', colPositions.night, y)
          .text(med.duration || '-', colPositions.duration, y)
          .text(med.waitingPeriod || '-', colPositions.waiting, y)
          .text(treatment.status || '-', colPositions.status, y)
          .text(treatment.effectiveness || '-', colPositions.effectiveness, y)
          .text(treatment.notes || '-', colPositions.notes, y)
          .text(treatment.reason || '-', colPositions.reason, y);

        y += 20;

        // Page break
        if (y > 750) {
          doc.addPage();
          y = 50;
          addTableHeader(y);
          y += 20;
        }
      });
    });

    doc.end();
  } catch (err) {
    console.error('PDF Generation Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { generateAnimalReport };
