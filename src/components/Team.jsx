"use client";
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Chat, Channel, ChannelHeader, MessageInput, MessageList, Thread, Window } from 'stream-chat-react';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import '@/globals.css';
import 'stream-chat-react/dist/css/v2/index.css';

const apiKey = 'vyaz8uzwffwu';

// Fetch user data function
const fetchUserData = async () => {
    try {
        const session = await getSession(); // Retrieve session
        const userId = session?.user?._id; // Extract user ID
        const fullName = session?.user?.fullName; // Extract user full name
        const response = await axios.get(`/api/profile?id=${userId}`); // Fetch token or additional data
        const token = response.data?.user?.token; // Extract token
        return { userId, fullName, token };
    } catch (err) {
        console.error("Error fetching user data:", err);
        return { userId: null, fullName: null, token: null }; // Return nulls if error
    }
};

export default function Team({ slug }) {
    const [channel, setChannel] = useState();
    const [client, setClient] = useState();
    const [userId, setUserId] = useState();
    const [fullName, setFullName] = useState();
    const [token, setToken] = useState();

    Team.propTypes = {
        slug: PropTypes.string.isRequired,
    };

    // Fetch user data and set states
    useEffect(() => {
        const initializeUserData = async () => {
            const { userId, fullName, token } = await fetchUserData();
            setUserId(userId);
            setFullName(fullName);
            setToken(token);

            // Initialize chat client
            if (userId && token) {
                const StreamChat = (await import('stream-chat')).StreamChat; // Lazy-load StreamChat
                const chatClient = StreamChat.getInstance(apiKey);
                await chatClient.connectUser({ id: userId, name: fullName }, token);
                setClient(chatClient);
            }
        };
        initializeUserData();
    }, []);

    // Create or join a channel
    useEffect(() => {
        if (!client || !slug || !userId) return;
        
        // Create or join channel
        const newChannel = client.channel('messaging', slug, {
            image: 'https://getstream.io/random_png/?name=react',
            name: slug.split('-').join(' '),
            members: [userId], // Add the current user to the channel
            is_public: true, // public
        });

        // Watch the channel to join it and start receiving messages
        newChannel.watch().then(() => {
            setChannel(newChannel);
        }).catch(err => {
            console.error("Error joining channel:", err);
        });

    }, [client, slug, userId]); // Trigger when client or slug or userId changes

    if (!client || !channel) return <div>Setting up client & connection...</div>;

    // Define the stone-800 background color for the chat components
    const chatStyles = {
        backgroundColor: '#3f3f46', // stone-800 color
        color: '#f0f0f0', // Light text for contrast
    };

    return (
        <Chat client={client} style={chatStyles}  theme="str-chat__theme-dark">
            <Channel channel={channel}>
                <Window>
                    <ChannelHeader />
                    <MessageList style={chatStyles} />
                    <MessageInput style={chatStyles} />
                </Window>
                <Thread />
            </Channel>
        </Chat>
    );
}
