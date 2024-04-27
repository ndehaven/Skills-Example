package org.example;

import java.util.ArrayList;
import java.util.List;

public class Subscriber {
    private boolean weeklySubscription = false;
    private boolean dailySubscription = false;
    private List<Publisher.MealType> subscriptions;

    public Subscriber() {
        this.subscriptions = new ArrayList<>();
    }

    public void receiveNotification(String message) {
        System.out.println("Received: " + message);
    }

    public void subscribeToMealType(Publisher.MealType mealType) {
        subscriptions.add(mealType);
    }

    public void unsubscribeFromMealType(Publisher.MealType mealType) {
        subscriptions.remove(mealType);
    }

    public boolean isSubscribedToMealType(Publisher.MealType mealType) {
        return subscriptions.contains(mealType);
    }

    public void setDailySubscription(boolean subscribed) {
        this.dailySubscription = subscribed;
    }

    public boolean isDailySubscribed() {
        return this.dailySubscription;
    }

    public void setWeeklySubscription(boolean subscribed) {
        this.weeklySubscription = subscribed;
    }

    public boolean isWeeklySubscribed() {
        return this.weeklySubscription;
    }

    public void showSubscribedMeals(List<String> publishedMeals) {
        System.out.println("Subscribed Meals:");
        for (String meal : publishedMeals) {
            String[] mealParts = meal.split(", ");
            Publisher.MealType mealType = Publisher.MealType.valueOf(mealParts[1].split(": ")[1]);
            if (subscriptions.contains(mealType)) {
                System.out.println(meal);
            }
        }
    }
}