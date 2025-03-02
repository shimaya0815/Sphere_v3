import { FC, useState, useRef, useEffect } from 'react';
import { 
  FiMessageSquare, 
  FiPlus, 
  FiSearch, 
  FiPaperclip, 
  FiSend, 
  FiMoreVertical,
  FiUser,
  FiUsers,
  FiImage,
  FiSmile,
  FiClock,
  FiHash
} from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';

// チャンネルの型定義
interface Channel {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  members: number[];
  createdAt: string;
  lastMessageAt: string;
  unreadCount?: number;
}

// ユーザーの型定義
interface ChatUser {
  id: number;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
}

// メッセージの型定義
interface Message {
  id: string;
  channelId: string;
  userId: number;
  text: string;
  createdAt: string;
  attachments?: string[];
  reactions?: {
    [key: string]: number[];
  };
  isThread?: boolean;
  parentId?: string;
  mentions?: number[];
}

// モックデータ - チャンネル
const mockChannels: Channel[] = [
  {
    id: 'general',
    name: '全般',
    description: '全社に関連する話題を共有するチャンネルです',
    isPrivate: false,
    members: [1, 2, 3, 4, 5],
    createdAt: '2023-01-01T00:00:00',
    lastMessageAt: '2023-06-10T15:45:00',
    unreadCount: 0,
  },
  {
    id: 'accounting',
    name: '会計部門',
    description: '会計部門の情報共有用チャンネル',
    isPrivate: false,
    members: [1, 2, 3],
    createdAt: '2023-01-05T10:30:00',
    lastMessageAt: '2023-06-12T09:15:00',
    unreadCount: 3,
  },
  {
    id: 'tax',
    name: '税務部門',
    description: '税務部門の情報共有用チャンネル',
    isPrivate: false,
    members: [1, 4, 5],
    createdAt: '2023-01-10T14:20:00',
    lastMessageAt: '2023-06-11T16:30:00',
    unreadCount: 1,
  },
  {
    id: 'client-abc',
    name: '株式会社ABC',
    description: '株式会社ABCに関する情報共有チャンネル',
    isPrivate: true,
    members: [1, 2],
    createdAt: '2023-02-15T08:45:00',
    lastMessageAt: '2023-06-09T11:20:00',
    unreadCount: 0,
  },
  {
    id: 'random',
    name: '雑談',
    description: '業務外の話題もOK',
    isPrivate: false,
    members: [1, 2, 3, 4, 5],
    createdAt: '2023-01-20T12:10:00',
    lastMessageAt: '2023-06-12T13:10:00',
    unreadCount: 5,
  },
];

// モックデータ - ユーザー
const mockUsers: ChatUser[] = [
  {
    id: 1,
    name: '山田太郎',
    status: 'online',
  },
  {
    id: 2,
    name: '鈴木一郎',
    status: 'online',
    lastSeen: '2023-06-12T15:30:00',
  },
  {
    id: 3,
    name: '田中花子',
    status: 'offline',
    lastSeen: '2023-06-12T10:15:00',
  },
  {
    id: 4,
    name: '佐藤次郎',
    status: 'away',
    lastSeen: '2023-06-12T14:45:00',
  },
  {
    id: 5,
    name: '高橋三郎',
    status: 'online',
  },
];

// モックデータ - メッセージ
const mockMessages: { [key: string]: Message[] } = {
  'general': [
    {
      id: 'msg1',
      channelId: 'general',
      userId: 1,
      text: 'みなさん、おはようございます！',
      createdAt: '2023-06-10T09:00:00',
    },
    {
      id: 'msg2',
      channelId: 'general',
      userId: 2,
      text: 'おはようございます！今日の会議は10時からですね。',
      createdAt: '2023-06-10T09:05:00',
    },
    {
      id: 'msg3',
      channelId: 'general',
      userId: 3,
      text: 'おはようございます。会議資料を共有しておきます。',
      createdAt: '2023-06-10T09:10:00',
      attachments: ['meeting-doc.pdf'],
    },
    {
      id: 'msg4',
      channelId: 'general',
      userId: 1,
      text: 'ありがとうございます！@田中花子 プレゼン資料の最終確認をお願いできますか？',
      createdAt: '2023-06-10T09:15:00',
      mentions: [3],
    },
    {
      id: 'msg5',
      channelId: 'general',
      userId: 3,
      text: '確認します。昼までには完了させます。',
      createdAt: '2023-06-10T09:20:00',
    },
    {
      id: 'msg6',
      channelId: 'general',
      userId: 5,
      text: '今日のランチはどうしますか？新しいカフェがオープンしたらしいですよ。',
      createdAt: '2023-06-10T11:30:00',
    },
    {
      id: 'msg7',
      channelId: 'general',
      userId: 4,
      text: 'いいですね！行ってみましょう',
      createdAt: '2023-06-10T11:35:00',
      reactions: {
        '👍': [1, 2, 3],
        '🎉': [1, 5],
      },
    },
    {
      id: 'msg8',
      channelId: 'general',
      userId: 2,
      text: '私も行きます！12時に集合しましょう',
      createdAt: '2023-06-10T11:40:00',
    },
    {
      id: 'msg9',
      channelId: 'general',
      userId: 1,
      text: '会議の議事録を共有します。来週のタスクも記載していますので確認お願いします。',
      createdAt: '2023-06-10T15:45:00',
      attachments: ['meeting-minutes.docx'],
    },
  ],
  'accounting': [
    {
      id: 'acc1',
      channelId: 'accounting',
      userId: 1,
      text: '今月の経費精算書の提出期限は来週金曜日までです。',
      createdAt: '2023-06-12T09:00:00',
    },
    {
      id: 'acc2',
      channelId: 'accounting',
      userId: 2,
      text: '了解しました。今週中に提出します。',
      createdAt: '2023-06-12T09:10:00',
    },
    {
      id: 'acc3',
      channelId: 'accounting',
      userId: 3,
      text: '経費精算のフォーマットが変更されましたので、新しいテンプレートを使用してください。',
      createdAt: '2023-06-12T09:15:00',
      attachments: ['expense-template.xlsx'],
    },
  ],
};

// 日付をフォーマットする関数
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
  } else if (diffInDays === 1) {
    return '昨日';
  } else if (diffInDays < 7) {
    return `${diffInDays}日前`;
  } else {
    return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
  }
};

// ステータスに応じたクラス名を取得する関数
const getStatusClass = (status: string): string => {
  switch (status) {
    case 'online':
      return 'bg-green-500';
    case 'away':
      return 'bg-yellow-500';
    case 'offline':
    default:
      return 'bg-gray-400';
  }
};

const ChatHome: FC = () => {
  const { user } = useAuth();
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(mockChannels[0]);
  const [messages, setMessages] = useState<Message[]>(mockMessages[mockChannels[0].id] || []);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [channelSearchQuery, setChannelSearchQuery] = useState('');
  const [showMembersList, setShowMembersList] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // メッセージが追加されたらスクロールする
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // チャンネル選択時の処理
  const handleSelectChannel = (channel: Channel) => {
    setSelectedChannel(channel);
    setMessages(mockMessages[channel.id] || []);
    setShowMembersList(false);
  };

  // メッセージ送信の処理
  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedChannel) return;

    const newMessage: Message = {
      id: `new-${Date.now()}`,
      channelId: selectedChannel.id,
      userId: user?.id ? Number(user.id) : 1, // 現在のユーザーID
      text: messageText,
      createdAt: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
    setMessageText('');
  };

  // フィルタリングされたチャンネルを取得
  const filteredChannels = mockChannels.filter((channel) => 
    channel.name.toLowerCase().includes(channelSearchQuery.toLowerCase())
  );

  // チャンネルのメンバー情報を取得
  const getChannelMembers = (channel: Channel) => {
    return mockUsers.filter((user) => channel.members.includes(user.id));
  };

  // メッセージの送信者情報を取得
  const getMessageSender = (userId: number) => {
    return mockUsers.find((user) => user.id === userId);
  };

  // キー入力による送信
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col h-[calc(100vh-180px)] bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          {/* サイドバー */}
          <div className="w-64 flex flex-col bg-gray-50 border-r border-gray-200">
            {/* チャンネル検索 */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="チャンネルを検索..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={channelSearchQuery}
                  onChange={(e) => setChannelSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* チャンネルリスト */}
            <div className="flex-1 overflow-y-auto py-2">
              <div className="px-4 py-2 flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-500">チャンネル</h3>
                <button className="text-gray-500 hover:text-gray-700">
                  <FiPlus />
                </button>
              </div>
              <ul>
                {filteredChannels.map((channel) => (
                  <li key={channel.id}>
                    <button
                      className={`w-full text-left px-4 py-2 flex items-center space-x-2 ${
                        selectedChannel?.id === channel.id
                          ? 'bg-blue-50 text-blue-600'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                      onClick={() => handleSelectChannel(channel)}
                    >
                      <span className="text-gray-500">
                        {channel.isPrivate ? <FiUser size={14} /> : <FiHash size={14} />}
                      </span>
                      <span className="truncate">{channel.name}</span>
                      {channel.unreadCount ? (
                        <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {channel.unreadCount}
                        </span>
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="px-4 py-2 mt-4 flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-500">ダイレクトメッセージ</h3>
                <button className="text-gray-500 hover:text-gray-700">
                  <FiPlus />
                </button>
              </div>
              <ul>
                {mockUsers.filter(u => u.id !== (user?.id ? Number(user.id) : 1)).map((chatUser) => (
                  <li key={chatUser.id}>
                    <button
                      className="w-full text-left px-4 py-2 flex items-center space-x-2 hover:bg-gray-100 text-gray-700"
                    >
                      <div className="relative">
                        <div className="w-2 h-2 absolute right-0 bottom-0 rounded-full border border-white" 
                          style={{backgroundColor: getStatusClass(chatUser.status)}}
                        ></div>
                        <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs uppercase">
                          {chatUser.name.charAt(0)}
                        </div>
                      </div>
                      <span className="truncate">{chatUser.name}</span>
                      <span className={`w-2 h-2 rounded-full ml-auto ${getStatusClass(chatUser.status)}`}></span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* チャットエリア */}
          <div className="flex-1 flex flex-col">
            {/* チャンネルヘッダー */}
            {selectedChannel && (
              <div className="flex justify-between items-center px-6 py-3 border-b border-gray-200">
                <div>
                  <h2 className="text-lg font-semibold flex items-center space-x-2">
                    <span className="text-gray-500">
                      {selectedChannel.isPrivate ? <FiUser /> : <FiHash />}
                    </span>
                    <span>{selectedChannel.name}</span>
                  </h2>
                  {selectedChannel.description && (
                    <p className="text-sm text-gray-500">{selectedChannel.description}</p>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                    onClick={() => setShowMembersList(!showMembersList)}
                  >
                    <FiUsers />
                  </button>
                  <div className="flex -space-x-1">
                    {getChannelMembers(selectedChannel).slice(0, 3).map((member) => (
                      <div key={member.id} className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs uppercase ring-2 ring-white">
                        {member.name.charAt(0)}
                      </div>
                    ))}
                    {selectedChannel.members.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 ring-2 ring-white">
                        +{selectedChannel.members.length - 3}
                      </div>
                    )}
                  </div>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                    <FiSearch />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                    <FiMoreVertical />
                  </button>
                </div>
              </div>
            )}

            {/* メッセージリスト */}
            <div className="flex-1 overflow-y-auto p-6">
              {messages.map((message) => {
                const sender = getMessageSender(message.userId);
                return (
                  <div key={message.id} className="mb-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-md uppercase">
                          {sender?.name.charAt(0)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <p className="font-medium text-gray-900">{sender?.name}</p>
                          <span className="ml-2 text-xs text-gray-500">
                            {formatDate(message.createdAt)}
                          </span>
                        </div>
                        <div className="mt-1 text-gray-700 whitespace-pre-wrap">
                          {message.text}
                        </div>
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2">
                            {message.attachments.map((attachment, index) => (
                              <div key={index} className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-lg text-sm text-gray-700 mr-2">
                                <FiPaperclip className="mr-1" />
                                {attachment}
                              </div>
                            ))}
                          </div>
                        )}
                        {message.reactions && Object.keys(message.reactions).length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {Object.entries(message.reactions).map(([emoji, users]) => (
                              <button key={emoji} className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200">
                                <span className="mr-1">{emoji}</span>
                                <span className="text-gray-600">{users.length}</span>
                              </button>
                            ))}
                            <button className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200">
                              <FiSmile />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* メッセージ入力エリア */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-end">
                <div className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                  <textarea
                    placeholder={`#${selectedChannel?.name}にメッセージを送信...`}
                    className="w-full focus:outline-none resize-none"
                    rows={2}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={handleKeyDown}
                  ></textarea>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex space-x-2">
                      <button className="p-1 text-gray-500 hover:text-gray-700 rounded">
                        <FiPaperclip />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-gray-700 rounded">
                        <FiImage />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-gray-700 rounded">
                        <FiSmile />
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  className={`ml-2 p-3 rounded-full ${
                    messageText.trim()
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                >
                  <FiSend />
                </button>
              </div>
            </div>
          </div>

          {/* メンバーリスト */}
          {showMembersList && selectedChannel && (
            <div className="w-64 border-l border-gray-200 bg-gray-50">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">メンバー ({selectedChannel.members.length})</h3>
              </div>
              <div className="p-4">
                <ul className="space-y-2">
                  {getChannelMembers(selectedChannel).map((member) => (
                    <li key={member.id} className="flex items-center">
                      <div className="relative mr-2">
                        <div className="w-2 h-2 absolute right-0 bottom-0 rounded-full border border-white" 
                          style={{backgroundColor: getStatusClass(member.status)}}
                        ></div>
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm uppercase">
                          {member.name.charAt(0)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {member.name}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center">
                          {member.status === 'online' ? (
                            <span className="flex items-center">
                              <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                              オンライン
                            </span>
                          ) : member.status === 'away' ? (
                            <span className="flex items-center">
                              <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>
                              離席中
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <FiClock className="mr-1" size={12} />
                              {member.lastSeen ? formatDate(member.lastSeen) : 'オフライン'}
                            </span>
                          )}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHome;