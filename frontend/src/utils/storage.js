const STORAGE_KEYS = {
  BOOKS: "library_books",
  MEMBERS: "library_members",
  TRANSACTIONS: "library_transactions",
};

// Generic storage utilities
export const storage = {
  get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  set(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  },

  clear(key) {
    localStorage.removeItem(key);
  },
};

// Book storage operations
export const bookStorage = {
  getAll() {
    return storage.get(STORAGE_KEYS.BOOKS);
  },

  save(books) {
    storage.set(STORAGE_KEYS.BOOKS, books);
  },

  add(book) {
    const books = bookStorage.getAll();

    const newBook = {
      ...book,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    books.push(newBook);
    bookStorage.save(books);
    return newBook;
  },

  update(id, updates) {
    const books = bookStorage.getAll();
    const index = books.findIndex((book) => book.id === id);
    if (index === -1) return null;

    books[index] = {
      ...books[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    bookStorage.save(books);
    return books[index];
  },

  delete(id) {
    const books = bookStorage.getAll();
    const filtered = books.filter((book) => book.id !== id);
    if (filtered.length === books.length) return false;

    bookStorage.save(filtered);
    return true;
  },
};

// Member storage operations
export const memberStorage = {
  getAll() {
    return storage.get(STORAGE_KEYS.MEMBERS);
  },

  save(members) {
    storage.set(STORAGE_KEYS.MEMBERS, members);
  },

  add(member) {
    const members = memberStorage.getAll();

    const newMember = {
      ...member,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    members.push(newMember);
    memberStorage.save(members);
    return newMember;
  },

  update(id, updates) {
    const members = memberStorage.getAll();
    const index = members.findIndex((member) => member.id === id);
    if (index === -1) return null;

    members[index] = {
      ...members[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    memberStorage.save(members);
    return members[index];
  },

  delete(id) {
    const members = memberStorage.getAll();
    const filtered = members.filter((member) => member.id !== id);
    if (filtered.length === members.length) return false;

    memberStorage.save(filtered);
    return true;
  },
};

// Transaction storage operations
export const transactionStorage = {
  getAll() {
    return storage.get(STORAGE_KEYS.TRANSACTIONS);
  },

  save(transactions) {
    storage.set(STORAGE_KEYS.TRANSACTIONS, transactions);
  },

  add(transaction) {
    const transactions = transactionStorage.getAll();

    const newTransaction = {
      ...transaction,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    transactions.push(newTransaction);
    transactionStorage.save(transactions);
    return newTransaction;
  },

  update(id, updates) {
    const transactions = transactionStorage.getAll();
    const index = transactions.findIndex(
      (transaction) => transaction.id === id
    );
    if (index === -1) return null;

    transactions[index] = {
      ...transactions[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    transactionStorage.save(transactions);
    return transactions[index];
  },
};

// Initialize with sample data if empty
export const initializeSampleData = () => {
  if (bookStorage.getAll().length === 0) {
    const sampleBooks = [
      {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        isbn: "978-0-7432-7356-5",
        category: "Fiction",
        publishedYear: 1925,
        totalCopies: 5,
        availableCopies: 3,
        description: "A classic American novel set in the Jazz Age.",
      },
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        isbn: "978-0-06-112008-4",
        category: "Fiction",
        publishedYear: 1960,
        totalCopies: 4,
        availableCopies: 2,
        description:
          "A gripping tale of racial injustice and childhood innocence.",
      },
      {
        title: "1984",
        author: "George Orwell",
        isbn: "978-0-452-28423-4",
        category: "Science Fiction",
        publishedYear: 1949,
        totalCopies: 6,
        availableCopies: 4,
        description: "A dystopian social science fiction novel.",
      },
    ];

    sampleBooks.forEach((book) => bookStorage.add(book));
  }

  if (memberStorage.getAll().length === 0) {
    const sampleMembers = [
      {
        name: "John Doe",
        email: "john.doe@email.com",
        phone: "+1-555-0123",
        address: "123 Main St, City, State 12345",
        membershipType: "student",
        joinDate: "2024-01-15",
        isActive: true,
      },
      {
        name: "Jane Smith",
        email: "jane.smith@email.com",
        phone: "+1-555-0456",
        address: "456 Oak Ave, City, State 12345",
        membershipType: "faculty",
        joinDate: "2024-02-01",
        isActive: true,
      },
    ];

    sampleMembers.forEach((member) => memberStorage.add(member));
  }
};
