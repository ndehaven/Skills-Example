package org.example;

import java.util.ArrayList;
import java.util.List;

public class Publisher {
    private List<String> publishedMeals;
    private Broker msgBroker;
    private String message;
    private boolean mealPublished = false;
    private boolean isWeekly = false;
    private boolean isDaily = false;
    private String mealName;
    private String[] meals;
    private int cookTime = 0; // Value is in mins

    public enum MealType {
        INDIAN,
        MEXICAN,
        CHINESE,
        ITALIAN,
        BRAZILIAN
    }

    public enum MealSpecific {
        BREAKFAST,
        LUNCH,
        DINNER
    }

    public Publisher(Broker broker) {
        this.msgBroker = broker;
        this.publishedMeals = new ArrayList<>();
    }

    public String publishMeal(MealType mealType, MealSpecific mealSpecific, String mealName, int cookTime, boolean isWeekly, boolean isDaily) {
        // Prepare message with meal details
        String message = "Meal Name: " + mealName + ", Meal Type: " + mealType + ", Meal Specific: " + mealSpecific + ", Cook Time: " + cookTime + " mins";

        // Publish message to broker
        msgBroker.publishMessage(message);

        // Add meal to the list of published meals
        publishedMeals.add(message);

        return "Meal Published";
    }

    public List<String> getPublishedMeals() {
        return publishedMeals;
    }
}
