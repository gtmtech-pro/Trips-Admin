import { v4 as uuidv4 } from 'uuid';

export class TripNoteModel {
    TripNoteId: string;
    TripId: string;
    ExpenseId: string;
    NoteTitle: string;
    NoteText: string;
    IsActive: boolean;
    RequestType: any;

    constructor(tripNoteItem?: any) {
        tripNoteItem = tripNoteItem || {};

        this.TripNoteId = tripNoteItem.TripNoteId || uuidv4();
        this.TripId = tripNoteItem.TripId || null;
        this.ExpenseId = tripNoteItem.ExpenseId || null;
        this.NoteTitle = tripNoteItem.NoteTitle || '';
        this.NoteText = tripNoteItem.NoteText || '';
        this.IsActive = tripNoteItem.IsActive || true;
        this.RequestType = 0; // New
    }
}
