import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Button } from './ui/button';
import { FaArrowUp } from 'react-icons/fa';

type FormData = {
   prompt: string;
};

const ChatBot = () => {
   // Generate once and persist across renders
   const conversationId = useRef<string>(crypto.randomUUID());

   const {
      register,
      handleSubmit,
      reset,
      formState: { isValid },
   } = useForm<FormData>({
      mode: 'onChange',
   });

   const onSubmit = async ({ prompt }: FormData) => {
      reset();

      const { data } = await axios.post('/api/chat', {
         prompt,
         conversationId: conversationId.current,
      });

      console.log(data);
   };

   // NOTE:
   // react-hooks/refs is a false positive with react-hook-form
   // This suppression is intentional and safe
   // eslint-disable-next-line react-hooks/refs
   const submitForm = handleSubmit(onSubmit);

   const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         submitForm();
      }
   };

   return (
      <form
         onSubmit={(e) => submitForm(e)}
         onKeyDown={onKeyDown}
         className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
      >
         <textarea
            {...register('prompt', {
               required: true,
               validate: (value) => value.trim().length > 0,
            })}
            className="w-full border-0 focus:outline-0 resize-none"
            placeholder="Ask anything you want!"
            maxLength={1000}
         />

         <Button
            type="submit"
            disabled={!isValid}
            className="rounded-full w-9 h-9"
         >
            <FaArrowUp />
         </Button>
      </form>
   );
};

export default ChatBot;
