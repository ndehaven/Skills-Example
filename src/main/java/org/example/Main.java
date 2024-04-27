package org.example;

import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Broker broker = new Broker();
        Scanner scanner = new Scanner(System.in);

        while (true) {
            System.out.println("Welcome to the Nutritionist System!");
            System.out.println("Are you a Publisher (P) or a Subscriber (S)?");
            String userInput = scanner.nextLine().toUpperCase();

            if (userInput.equals("P")) {
                // User is a publisher
                Publisher nutritionist = new Publisher(broker);

                // Publisher menu
                while (true) {
                    System.out.println("Publisher Menu:");
                    System.out.println("1. Publish a meal");
                    System.out.println("2. Exit");
                    int choice = scanner.nextInt();
                    scanner.nextLine(); // Consume newline character

                    switch (choice) {
                        case 1:
                            // Publish a meal
                            System.out.println("Enter meal details:\n");
                            System.out.println("Enter a Meal Type: INDIAN, MEXICAN, CHINESE, ITALIAN, BRAZILIAN\n");
                            String mealType = scanner.nextLine();
                            System.out.println("Enter a Cuisine Type: BREAKFAST, LUNCH, DINNER\n");
                            String mealSpecific = scanner.nextLine();
                            System.out.println("Enter a Meal Name:");
                            String mealName = scanner.nextLine();
                            System.out.println("Enter a Cook Time(mins) :\n");
                            int cookTime = scanner.nextInt();
                            scanner.nextLine(); // Consume newline character
                            System.out.println("Is this a weekly plan?(true/false)\n");
                            boolean isWeekly = scanner.nextBoolean();
                            scanner.nextLine(); // Consume newline character
                            System.out.println("Is this a daily plan?(true/false)\n");
                            boolean isDaily = scanner.nextBoolean();
                            scanner.nextLine(); // Consume newline character
                            nutritionist.publishMeal(
                                    Publisher.MealType.valueOf(mealType.toUpperCase()),
                                    Publisher.MealSpecific.valueOf(mealSpecific.toUpperCase()),
                                    mealName,
                                    cookTime,
                                    isWeekly,
                                    isDaily
                            );
                            break;
                        case 2:
                            System.out.println("Exiting publisher mode.");
                            break;
                        default:
                            System.out.println("Invalid choice.");
                    }

                    if (choice == 2) {
                        break; // Exit publisher menu loop
                    }
                }
            } else if (userInput.equals("S")) {
                Subscriber customer = new Subscriber();
                Map<Publisher.MealType, Boolean> subscriptions = new HashMap<>();

                // Subscriber menu
                while (true) {
                    System.out.println("Subscriber Menu:");
                    System.out.println("1. Subscribe to meal type");
                    System.out.println("2. Unsubscribe from meal type");
                    System.out.println("3. Subscribe to meal plan (Weekly)");
                    System.out.println("4. Subscribe to meal plan (Daily)");
                    System.out.println("5. Show meal subscriptions");
                    System.out.println("6. Exit");
                    int choice = scanner.nextInt();
                    scanner.nextLine(); // Consume newline character

                    switch (choice) {
                        case 1:
                            // Subscribe to meal type
                            System.out.println("Enter meal type to subscribe (e.g., INDIAN, MEXICAN, CHINESE, ITALIAN, BRAZILIAN):");
                            String mealType = scanner.nextLine().toUpperCase();
                            subscriptions.put(Publisher.MealType.valueOf(mealType), true);
                            break;
                        case 2:
                            // Unsubscribe from meal type
                            System.out.println("Enter meal type to unsubscribe (e.g., INDIAN, MEXICAN, CHINESE, ITALIAN, BRAZILIAN):");
                            String mealTypeToUnsubscribe = scanner.nextLine().toUpperCase();
                            subscriptions.remove(Publisher.MealType.valueOf(mealTypeToUnsubscribe));
                            break;
                        case 3:
                            // Subscribe to meal plan (Weekly)
                            customer.setWeeklySubscription(true);
                            System.out.println("Subscribed to meal plan (Weekly).");
                            break;
                        case 4:
                            // Subscribe to meal plan (Daily)
                            customer.setDailySubscription(true);
                            System.out.println("Subscribed to meal plan (Daily).");
                            break;
                        case 5:
                            // Show meal subscriptions
                            System.out.println("Meal subscriptions:");
                            for (Map.Entry<Publisher.MealType, Boolean> entry : subscriptions.entrySet()) {
                                System.out.println(entry.getKey() + ": " + (entry.getValue() ? "Subscribed" : "Not Subscribed"));
                            }
                            break;
                        case 6:
                            System.out.println("Exiting subscriber mode.");
                            break;
                        default:
                            System.out.println("Invalid choice.");
                    }

                    if (choice == 6) {
                        break; // Exit subscriber menu loop
                    }
                }
            } else {
                System.out.println("Invalid input. Please enter either 'P' for Publisher or 'S' for Subscriber.");
            }
        }
    }
}