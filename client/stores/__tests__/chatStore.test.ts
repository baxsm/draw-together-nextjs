import { useChatStore } from "@/stores/chatStore";

beforeEach(() => {
	useChatStore.setState({
		messages: [],
		unreadCount: 0,
		typingUsers: new Map(),
	});
});

const createMessage = (id: string): MessageType => ({
	id,
	content: `Message ${id}`,
	createdAt: new Date().toISOString(),
	userId: "user-1",
	username: "Alice",
});

describe("useChatStore", () => {
	it("has initial state: empty messages", () => {
		expect(useChatStore.getState().messages).toEqual([]);
	});

	it("has initial state: unreadCount is 0", () => {
		expect(useChatStore.getState().unreadCount).toBe(0);
	});

	it("has initial state: empty typingUsers", () => {
		expect(useChatStore.getState().typingUsers.size).toBe(0);
	});

	it("addMessage appends a message", () => {
		const msg = createMessage("1");
		useChatStore.getState().addMessage(msg);
		expect(useChatStore.getState().messages).toHaveLength(1);
		expect(useChatStore.getState().messages[0]).toEqual(msg);
	});

	it("addMessage preserves existing messages", () => {
		useChatStore.getState().addMessage(createMessage("1"));
		useChatStore.getState().addMessage(createMessage("2"));
		expect(useChatStore.getState().messages).toHaveLength(2);
	});

	it("setMessages replaces all messages", () => {
		useChatStore.getState().addMessage(createMessage("1"));
		const newMessages = [createMessage("a"), createMessage("b")];
		useChatStore.getState().setMessages(newMessages);
		expect(useChatStore.getState().messages).toEqual(newMessages);
	});

	it("incrementUnread increases count by 1", () => {
		useChatStore.getState().incrementUnread();
		expect(useChatStore.getState().unreadCount).toBe(1);
	});

	it("incrementUnread accumulates", () => {
		useChatStore.getState().incrementUnread();
		useChatStore.getState().incrementUnread();
		useChatStore.getState().incrementUnread();
		expect(useChatStore.getState().unreadCount).toBe(3);
	});

	it("resetUnread sets count to 0", () => {
		useChatStore.getState().incrementUnread();
		useChatStore.getState().incrementUnread();
		useChatStore.getState().resetUnread();
		expect(useChatStore.getState().unreadCount).toBe(0);
	});

	it("setTyping adds a user to the typing map", () => {
		useChatStore.getState().setTyping("u1", "Alice");
		expect(useChatStore.getState().typingUsers.get("u1")).toBe("Alice");
	});

	it("clearTyping removes a user from the typing map", () => {
		useChatStore.getState().setTyping("u1", "Alice");
		useChatStore.getState().clearTyping("u1");
		expect(useChatStore.getState().typingUsers.has("u1")).toBe(false);
	});

	it("clearAllTyping empties the map", () => {
		useChatStore.getState().setTyping("u1", "Alice");
		useChatStore.getState().setTyping("u2", "Bob");
		useChatStore.getState().clearAllTyping();
		expect(useChatStore.getState().typingUsers.size).toBe(0);
	});
});
