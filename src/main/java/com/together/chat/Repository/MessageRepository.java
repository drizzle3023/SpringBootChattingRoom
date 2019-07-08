package com.together.chat.Repository;

import com.together.chat.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository("messageRepository")
public interface MessageRepository extends JpaRepository<Message, Long> {
    Message findById(int message_id);

}
