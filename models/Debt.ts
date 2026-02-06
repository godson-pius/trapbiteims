import mongoose from 'mongoose';

const DebtSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: [true, 'Please provide customer name'],
    },
    amount: {
        type: Number,
        required: [true, 'Please provide amount'],
    },
    description: {
        type: String,
        required: [true, 'Please provide description'],
    },
    dueDate: {
        type: Date,
        required: [true, 'Please provide due date'],
    },
    status: {
        type: String,
        enum: ['Pending', 'Paid'],
        default: 'Pending',
    },
    date: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            (ret as any).id = ret._id.toString();
            delete (ret as any)._id;
            delete (ret as any).__v;
        }
    }
});

export default mongoose.models.Debt || mongoose.model('Debt', DebtSchema);
