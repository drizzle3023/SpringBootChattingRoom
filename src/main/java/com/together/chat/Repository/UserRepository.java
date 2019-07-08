package com.together.chat.Repository;

import com.together.chat.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("userRepository")
public interface UserRepository extends JpaRepository<User, Long> {
    User findById(int user_id);
    List<User> findByActive(int active);
}
