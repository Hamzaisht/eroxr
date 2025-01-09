import { motion } from "framer-motion";
import { Calendar, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const upcomingEvents = [
  {
    title: "Photography Workshop",
    date: "May 15, 2024",
    time: "2:00 PM",
    attendees: [
      { name: "Sarah", avatar: "https://i.pravatar.cc/150?u=sarah" },
      { name: "Mike", avatar: "https://i.pravatar.cc/150?u=mike" },
      { name: "Anna", avatar: "https://i.pravatar.cc/150?u=anna" }
    ],
    totalAttendees: 15
  },
  {
    title: "Digital Art Masterclass",
    date: "May 18, 2024",
    time: "3:30 PM",
    attendees: [
      { name: "John", avatar: "https://i.pravatar.cc/150?u=john" },
      { name: "Emma", avatar: "https://i.pravatar.cc/150?u=emma" },
      { name: "Alex", avatar: "https://i.pravatar.cc/150?u=alex" }
    ],
    totalAttendees: 12
  }
];

export const UpcomingEvents = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-luxury-neutral flex items-center gap-2">
          <Calendar className="h-5 w-5 text-luxury-primary" />
          Upcoming Events
        </h2>
        <Button variant="ghost" size="sm" className="text-luxury-primary">
          View All
        </Button>
      </div>

      <div className="space-y-3">
        {upcomingEvents.map((event, index) => (
          <motion.div
            key={event.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group p-4 rounded-lg border border-luxury-neutral/10 hover:border-luxury-primary/20 bg-luxury-dark/30 hover:bg-luxury-dark/50 transition-all cursor-pointer"
          >
            <div className="space-y-3">
              <div>
                <h3 className="font-medium text-luxury-neutral group-hover:text-luxury-primary transition-colors">
                  {event.title}
                </h3>
                <p className="text-sm text-luxury-neutral/60">
                  {event.date} at {event.time}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center -space-x-2">
                  {event.attendees.map((attendee, i) => (
                    <Avatar key={i} className="h-8 w-8 border-2 border-luxury-dark">
                      <AvatarImage src={attendee.avatar} />
                      <AvatarFallback>{attendee.name[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                  {event.totalAttendees > 3 && (
                    <div className="h-8 w-8 rounded-full bg-luxury-primary/10 border-2 border-luxury-dark flex items-center justify-center">
                      <span className="text-xs text-luxury-primary">
                        +{event.totalAttendees - 3}
                      </span>
                    </div>
                  )}
                </div>
                <Button variant="ghost" size="icon" className="text-luxury-primary">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};