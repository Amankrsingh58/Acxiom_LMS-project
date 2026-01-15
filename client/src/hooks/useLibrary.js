import { useState, useEffect } from "react";
import {
  bookStorage,
  memberStorage,
  transactionStorage,
  initializeSampleData,
} from "../utils/storage";

export const useLibrary = () => {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    initializeSampleData();
    loadData();
  }, []);

  const loadData = () => {
    setBooks(bookStorage.getAll());
    setMembers(memberStorage.getAll());
    setTransactions(transactionStorage.getAll());
  };

  /* ---------------- BOOK OPERATIONS ---------------- */

  const addBook = (bookData) => {
    const newBook = bookStorage.add(bookData);
    setBooks((prev) => [...prev, newBook]);
    return newBook;
  };

  const updateBook = (id, updates) => {
    const updatedBook = bookStorage.update(id, updates);
    if (updatedBook) {
      setBooks((prev) =>
        prev.map((book) => (book.id === id ? updatedBook : book))
      );
    }
    return updatedBook;
  };

  const deleteBook = (id) => {
    const success = bookStorage.delete(id);
    if (success) {
      setBooks((prev) => prev.filter((book) => book.id !== id));
    }
    return success;
  };

  /* ---------------- MEMBER OPERATIONS ---------------- */

  const addMember = (memberData) => {
    const newMember = memberStorage.add(memberData);
    setMembers((prev) => [...prev, newMember]);
    return newMember;
  };

  const updateMember = (id, updates) => {
    const updatedMember = memberStorage.update(id, updates);
    if (updatedMember) {
      setMembers((prev) =>
        prev.map((member) =>
          member.id === id ? updatedMember : member
        )
      );
    }
    return updatedMember;
  };

  const deleteMember = (id) => {
    const success = memberStorage.delete(id);
    if (success) {
      setMembers((prev) =>
        prev.filter((member) => member.id !== id)
      );
    }
    return success;
  };

  /* ---------------- TRANSACTION OPERATIONS ---------------- */

  const issueBook = (bookId, memberId, dueDate) => {
    const book = books.find((b) => b.id === bookId);
    if (!book || book.availableCopies <= 0) return null;

    const transaction = transactionStorage.add({
      bookId,
      memberId,
      issueDate: new Date().toISOString(),
      dueDate,
      status: "issued",
    });

    updateBook(bookId, {
      availableCopies: book.availableCopies - 1,
    });

    setTransactions((prev) => [...prev, transaction]);
    return transaction;
  };

  const returnBook = (transactionId, fine) => {
    const transaction = transactions.find(
      (t) => t.id === transactionId
    );
    if (!transaction || transaction.status === "returned")
      return null;

    const updatedTransaction = transactionStorage.update(
      transactionId,
      {
        returnDate: new Date().toISOString(),
        status: "returned",
        fine,
      }
    );

    if (updatedTransaction) {
      const book = books.find(
        (b) => b.id === transaction.bookId
      );
      if (book) {
        updateBook(book.id, {
          availableCopies: book.availableCopies + 1,
        });
      }

      setTransactions((prev) =>
        prev.map((t) =>
          t.id === transactionId ? updatedTransaction : t
        )
      );
    }

    return updatedTransaction;
  };

  /* ---------------- DASHBOARD STATS ---------------- */

  const getDashboardStats = () => {
    const now = new Date();

    const overdueTransactions = transactions.filter(
      (t) => t.status === "issued" && new Date(t.dueDate) < now
    );

    overdueTransactions.forEach((t) => {
      if (t.status !== "overdue") {
        transactionStorage.update(t.id, {
          status: "overdue",
        });
      }
    });

    const issuedBooks = transactions.filter(
      (t) => t.status === "issued" || t.status === "overdue"
    ).length;

    const recentTransactions = [...transactions]
      .sort(
        (a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
      )
      .slice(0, 5);

    const bookIssueCount = transactions.reduce((acc, t) => {
      acc[t.bookId] = (acc[t.bookId] || 0) + 1;
      return acc;
    }, {});

    const popularBooks = Object.entries(bookIssueCount)
      .map(([bookId, issueCount]) => ({
        bookId,
        issueCount,
      }))
      .sort((a, b) => b.issueCount - a.issueCount)
      .slice(0, 5);

    return {
      totalBooks: books.length,
      totalMembers: members.length,
      issuedBooks,
      overdueBooks: overdueTransactions.length,
      recentTransactions,
      popularBooks,
    };
  };

  return {
    books,
    members,
    transactions,
    addBook,
    updateBook,
    deleteBook,
    addMember,
    updateMember,
    deleteMember,
    issueBook,
    returnBook,
    getDashboardStats,
    refreshData: loadData,
  };
};
