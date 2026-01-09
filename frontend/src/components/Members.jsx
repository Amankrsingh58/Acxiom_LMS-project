import React, { useState } from "react";
import { useLibrary } from "../hooks/useLibrary";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
} from "lucide-react";
import MemberModal from "./MemberModal";

const Members = () => {
  const { members, addMember, updateMember, deleteMember } = useLibrary();

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [viewingMember, setViewingMember] = useState(null);

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm);

    const matchesType =
      !typeFilter || member.membershipType === typeFilter;

    const matchesStatus =
      !statusFilter ||
      (statusFilter === "active" && member.isActive) ||
      (statusFilter === "inactive" && !member.isActive);

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAddMember = () => {
    setEditingMember(null);
    setIsModalOpen(true);
  };

  const handleEditMember = (member) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleDeleteMember = (id) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      deleteMember(id);
    }
  };

  const handleToggleStatus = (member) => {
    updateMember(member.id, { isActive: !member.isActive });
  };

  const handleSaveMember = (memberData) => {
    if (editingMember) {
      updateMember(editingMember.id, memberData);
    } else {
      addMember(memberData);
    }
    setIsModalOpen(false);
    setEditingMember(null);
  };

  const getMembershipTypeColor = (type) => {
    switch (type) {
      case "student":
        return "bg-blue-100 text-blue-800";
      case "faculty":
        return "bg-green-100 text-green-800";
      case "public":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const MemberCard = ({ member }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {member.name}
            </h3>
            {member.isActive ? (
              <UserCheck className="h-5 w-5 text-green-600" />
            ) : (
              <UserX className="h-5 w-5 text-red-600" />
            )}
          </div>

          <p className="text-sm text-gray-600 mb-2">{member.email}</p>

          <span
            className={`inline-block px-2 py-1 text-xs rounded-full ${getMembershipTypeColor(
              member.membershipType
            )}`}
          >
            {member.membershipType.charAt(0).toUpperCase() +
              member.membershipType.slice(1)}
          </span>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setViewingMember(member)}
            className="p-2 text-gray-500 hover:text-blue-600"
          >
            <Eye className="h-4 w-4" />
          </button>

          <button
            onClick={() => handleEditMember(member)}
            className="p-2 text-gray-500 hover:text-green-600"
          >
            <Edit className="h-4 w-4" />
          </button>

          <button
            onClick={() => handleDeleteMember(member.id)}
            className="p-2 text-gray-500 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Phone:</span>
          <span>{member.phone}</span>
        </div>

        <div className="flex justify-between">
          <span>Join Date:</span>
          <span>
            {new Date(member.joinDate).toLocaleDateString()}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span>Status:</span>
          <button
            onClick={() => handleToggleStatus(member)}
            className={`px-2 py-1 rounded text-xs font-medium ${
              member.isActive
                ? "bg-green-100 text-green-800 hover:bg-green-200"
                : "bg-red-100 text-red-800 hover:bg-red-200"
            }`}
          >
            {member.isActive ? "Active" : "Inactive"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Members Management
        </h2>

        <button
          onClick={handleAddMember}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
        >
          <Plus className="h-5 w-5" />
          <span>Add Member</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search members..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">All Types</option>
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="public">Public</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <p className="text-center text-gray-500">
          No members found.
        </p>
      )}

      {/* Modal */}
      {isModalOpen && (
        <MemberModal
          member={editingMember}
          onSave={handleSaveMember}
          onClose={() => {
            setIsModalOpen(false);
            setEditingMember(null);
          }}
        />
      )}

      {/* View Modal */}
      {viewingMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-xl font-bold mb-4">
              {viewingMember.name}
            </h3>

            <button
              onClick={() => setViewingMember(null)}
              className="mt-6 px-4 py-2 bg-gray-300 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
