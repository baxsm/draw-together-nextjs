import { FC } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import MessageFeed from "./MessageFeed";
import MessageInput from "./MessageInput";

const MessageBox: FC = () => {
  return (
    <div className="absolute right-4 bottom-4 z-20 max-w-xs w-full border dark:border-none rounded-2xl">
      <Accordion type="single" collapsible defaultValue="messages">
        <AccordionItem
          value="messages"
          className="border-none bg-background rounded-2xl"
        >
          <AccordionTrigger className="px-4">Messages</AccordionTrigger>
          <AccordionContent className="border-t">
            <MessageFeed />
            <MessageInput />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default MessageBox;
