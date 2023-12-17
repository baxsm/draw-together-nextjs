import { FC } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button, buttonVariants } from "../ui/button";
import MessageFeed from "./MessageFeed";
import MessageInput from "./MessageInput";

const Messages: FC = () => {
  return (
    <div className="absolute right-4 bottom-4 z-20 max-w-xs w-full border rounded-2xl">
      <Accordion
        type="single"
        collapsible
        defaultValue="messages"
        orientation="vertical"
      >
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

export default Messages;
