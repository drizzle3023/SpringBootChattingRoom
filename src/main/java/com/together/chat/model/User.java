package com.together.chat.model;

import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", updatable = false, nullable = false)
    @Getter @Setter
    private int id;
    @Column(name = "name")
    @NotEmpty(message = "*Please provide your name")
    @Getter @Setter
    private String name;
    @Column(name = "active")
    @Getter @Setter
    private int active;
    @OneToMany
    @JoinTable(name = "message", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "message_id"))
    private List<Message> messages;

}

