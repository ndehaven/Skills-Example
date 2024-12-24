package org.example;
import java.util.ArrayList;
import java.util.List;

public class Broker {
    private List<Subscriber> subscribers;
    private List<String> publishedMeals; // Store published meals

    public Broker() {
        this.subscribers = new ArrayList<>();
        this.publishedMeals = new ArrayList<>();
    }

    public void addSubscriber(Subscriber subscriber) {
        subscribers.add(subscriber);
    }

    public void publishMessage(String message) {
        publishedMeals.add(message); // Store published meal
        for (Subscriber subscriber : subscribers) {
            subscriber.receiveNotification(message);
        }
    }

    public List<String> getPublishedMeals() {
        return publishedMeals;
    }
}
