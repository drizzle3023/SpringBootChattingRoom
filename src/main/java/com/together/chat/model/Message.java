package com.together.chat.model;

import lombok.*;

import javax.persistence.*;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "message")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id", updatable = false, nullable = false)
    @Getter @Setter
    private int id;
    @Column(name = "content")
    @Getter @Setter
    private String content;
    @Column(name = "user_id")
    @Getter @Setter
    private int user_id;
    @Column(name = "user_name")
    @Getter @Setter
    private String user_name;
}

