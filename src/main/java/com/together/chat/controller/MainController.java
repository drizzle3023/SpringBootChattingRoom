package com.together.chat.controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.together.chat.Service.MessageService;
import com.together.chat.Service.UserService;
import com.together.chat.model.Message;
import com.together.chat.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

@Controller
public class MainController {

    @Autowired
    private UserService userService;

    @Autowired
    private MessageService messageService;

    @Autowired
    private ServletContext servletContext;

    @RequestMapping(value = "/")
    public String index(HttpServletRequest request, Model model) {
        String userName = (String)request.getSession().getAttribute("username");
        Integer userId = (Integer)request.getSession().getAttribute("user_id");

        if (userName == null || userName.isEmpty() || userId == null) {
            return "redirect:/login";
        }

        model.addAttribute("username", userName);
        model.addAttribute("user_id", userId);
        model.addAttribute("contextPath", servletContext.getContextPath());

        userService.updateUserActiveState(userId.intValue(), 1);
        return "chat";
    }

    @RequestMapping(path = "/login", method = RequestMethod.GET)
    public String showLoginPage() {
        return "login";
    }

    @RequestMapping(path = "/login", method = RequestMethod.POST)
    public String doLogin(HttpServletRequest request,
                          @RequestParam(defaultValue = "") String username) {
        username = username.trim();

        if (username.isEmpty()) {
            return "login";
        }

        User user = new User();
        user.setName(username);
        user = userService.saveUser(user);
        request.getSession().setAttribute("user_id", user.getId());
        request.getSession().setAttribute("username", user.getName());

        return "redirect:/";
    }

    @RequestMapping(path = "/logout")
    public String logout(HttpServletRequest request) {
        request.getSession(true).invalidate();

        return "redirect:/login";
    }

    @RequestMapping(path = "/search", method = RequestMethod.GET)
    public String search(HttpServletRequest request, Model model) {

        String userName = (String)request.getSession().getAttribute("username");
        Integer userId = (Integer)request.getSession().getAttribute("user_id");

        if (userName == null || userName.isEmpty() || userId == null) {
            return "redirect:/login";
        }

        model.addAttribute("username", userName);
        model.addAttribute("user_id", userId);
        model.addAttribute("contextPath", servletContext.getContextPath());

        return "search";
    }

    @RequestMapping(path = "/search", method = RequestMethod.POST, produces = "application/json")
    @ResponseBody
    public String doSearch(HttpServletRequest request,

                          @RequestParam() Integer search_type,
                           @RequestParam(defaultValue = "") String content) {
        content = content.trim();

        if (!content.isEmpty()) {

            if (search_type.intValue() == 0) {
                // Do Search for text in messages
                List<Message> messageslist = messageService.searchForTextinMessages(content);
                Gson gsonBuilder = new GsonBuilder().create();
                String messagelistJson = gsonBuilder.toJson(messageslist);
                return messagelistJson;
            } else {
                // Do Search for messages by user name
                List<Message> messageslist = messageService.searchForMessagesbyUserName(content);
                Gson gsonBuilder = new GsonBuilder().create();
                String messagelistJson = gsonBuilder.toJson(messageslist);
                return messagelistJson;
            }
        }
        return null;
    }

    @RequestMapping(value = "/getActiveUsers", method = RequestMethod.POST, produces = "application/json")
    @ResponseBody
    public String getActiveUsers(HttpServletRequest request, HttpServletResponse response) {

        // Get User list and last 3 messages
        List<User> userlist = userService.getActiveUserList();
        Gson gsonBuilder = new GsonBuilder().create();
        String userlistJson = gsonBuilder.toJson(userlist);
        return userlistJson;

    }

    @RequestMapping(value = "/getLastMessages", method = RequestMethod.POST, produces = "application/json")
    @ResponseBody
    public String getLastMessages(HttpServletRequest request, HttpServletResponse response) {

        // Get User list and last 3 messages
        List<Message> messageslist = messageService.getLastMessages();
        Gson gsonBuilder = new GsonBuilder().create();
        String messagelistJson = gsonBuilder.toJson(messageslist);
        return messagelistJson;

    }

}
