"use client";

import React, { useState, useEffect } from "react";
import { Users, UserPlus, User } from "lucide-react";
import axios from "axios";
import Link from "next/link";

// Empty State Component
const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-10 text-stone-400">
    <Users className="w-12 h-12 mb-3 opacity-50" />
    <p className="text-sm">{message}</p>
  </div>
);

// Loading State Component
const LoadingState = () => (
  <div className="flex justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-400"></div>
  </div>
);

// Created Teams Component
const CreatedTeams = () => {
  const [createdTeams, setCreatedTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCreatedTeams = async () => {
      try {
        const response = await axios.get('/api/showCreatedTeams');
        setCreatedTeams(response.data.teams);
        console.log(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load teams');
        setLoading(false);
      }
    };

    fetchCreatedTeams();
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <EmptyState message={error} />;

  return (
    <div>
      <div className="px-4 py-2 bg-stone-800/50">
        <h2 className="text-sm font-medium text-stone-400">Created by me</h2>
      </div>
      {createdTeams.length > 0 ? (
        createdTeams.map((team) => (
          <TeamListItem key={team._id} team={team} />
        ))
      ) : (
        <EmptyState message="You haven't created any teams yet" />
      )}
    </div>
  );
};

// Joined Teams Component
const JoinedTeams = () => {
  const [joinedTeams, setJoinedTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
  
    const fetchJoinedTeams = async () => {
      try {
        const response = await axios.get('/api/showJoinedTeams', {
          signal: controller.signal, // Attach abort signal
        });
    
        console.log('Joined teams:', response.data.data); // Log the data directly
        setJoinedTeams(response.data.data); // Use the data to set state
      } catch (err) {
        if (err.name === 'CanceledError') {
          console.log('Fetch aborted');
          return; // Ignore abort errors
        }
        setError('Failed to load teams');
      } finally {
        setLoading(false);
      }
    };
    
    fetchJoinedTeams();
    
    return () => {
      controller.abort(); // Cleanup on unmount
    };
  }, []);    
  
  if (loading) return <LoadingState />;
  if (error) return <EmptyState message={error} />;

  return (
    <div>
      <div className="px-4 py-2 bg-stone-800/50">
        <h2 className="text-sm font-medium text-stone-400">Teams joined</h2>
      </div>
      {joinedTeams.length > 0 ? (
        joinedTeams.map((team) => (
          <TeamListItem key={team._id} team={team} />
        ))
      ) : (
        <EmptyState message="You haven't joined any teams yet" />
      )}
    </div>
  );
};

// Reusable Team List Item Component
const TeamListItem = ({ team }) => {
  const [teamLeader, setTeamLeader] = useState(null);
  const [teamSlug, setTeamSlug] = useState(null);
  useEffect(() => {
    const fetchTeamLeader = async () => {
      try {
        const response = await axios.get(`/api/profile?id=${team.createdBy}`);
        console.log("team leader details: " + response.data);
        setTeamLeader(response.data.user);
      } catch (err) {
        console.error(err);
      }
    }
    fetchTeamLeader();
  }, [team.createdBy]);
  useEffect(() => {
    const createSlug = async () => {
      try {
        const slug = team.name.toLowerCase().replace(/ /g, "-");
        setTeamSlug(slug);
      } catch (err) {
        console.error(err);
      }
    }
    createSlug();
  }
  );
  return (
    <Link href={`/team/${teamSlug}`}>
    <div className="flex items-center px-4 py-3 border-b border-stone-800 hover:bg-stone-800/50 cursor-pointer transition-colors">
      <div className="w-12 h-12 rounded-full bg-stone-700 flex items-center justify-center mr-4 flex-shrink-0">
        <span className="text-lg font-semibold text-stone-100">
          {team.name.charAt(0)}
        </span>
      </div>
      
      <div className="flex-grow min-w-0">
        <div className="flex items-center justify-between">
          <h2 className="text-stone-100 font-medium truncate">{team.name}</h2>
          <button size="sm" className="ml-4 bg-stone-700 text-stone-100 px-2 py-1 rounded-md text-xs font-medium hover:bg-stone-600 transition-colors">
            Open Team
          </button>
        </div>
        
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-stone-400 truncate">
            Created by {teamLeader?.fullName || "Unknown"} • {" "}
            {team.members.length > 0
              ? `${team.members.length+1} members`
              : "No members yet"}
          </span>
        </div>
      </div>
    </div>
  </Link>
  );
};

// Main Page Component
const Page = () => {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="min-h-screen bg-stone-800 w-full">
      {/* Header */}
      <div className="bg-stone-800 px-4 py-3 sticky top-0">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-stone-100" />
            <h1 className="text-xl font-semibold text-stone-100">Teams</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mt-4 px-4 max-w-3xl mx-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`text-sm font-medium pb-2 border-b-2 transition-colors ${activeTab === 'all'
                ? 'text-stone-100 border-stone-100'
                : 'text-stone-400 border-transparent hover:text-stone-300'
              }`}
          >
            All Teams
          </button>
          <button
            onClick={() => setActiveTab('created')}
            className={`text-sm font-medium pb-2 border-b-2 transition-colors ${activeTab === 'created'
                ? 'text-stone-100 border-stone-100'
                : 'text-stone-400 border-transparent hover:text-stone-300'
              }`}
          >
            Created
          </button>
          <button
            onClick={() => setActiveTab('joined')}
            className={`text-sm font-medium pb-2 border-b-2 transition-colors ${activeTab === 'joined'
                ? 'text-stone-100 border-stone-100'
                : 'text-stone-400 border-transparent hover:text-stone-300'
              }`}
          >
            Joined
          </button>
        </div>
      </div>

      {/* Teams List */}
      <div className="max-w-3xl mx-auto">
        {activeTab === 'all' && (
          <>
            <CreatedTeams />
            <JoinedTeams />
          </>
        )}
        {activeTab === 'created' && <CreatedTeams />}
        {activeTab === 'joined' && <JoinedTeams />}
      </div>
    </div>
  );
};

export default Page;