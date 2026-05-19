import { useEffect, useState } from "react";

export default function App() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [relation, setRelation] = useState("");
  const [eventType, setEventType] = useState("Birthday");
  const [search, setSearch] = useState("");

  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem("bondly-events");
    return savedEvents ? JSON.parse(savedEvents) : [];
  });

  useEffect(() => {
    localStorage.setItem("bondly-events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const handleSubmit = () => {
    if (!name || !date || !relation) {
      alert("Please fill all fields");
      return;
    }

    const newEvent = {
      name,
      date,
      relation,
      eventType,
    };

    setEvents([...events, newEvent]);

    if (Notification.permission === "granted") {
      new Notification("Event Saved 🎉", {
        body: `${name}'s ${eventType} added successfully`,
      });
    }

    setName("");
    setDate("");
    setRelation("");
    setEventType("Birthday");
  };

  const deleteEvent = (indexToDelete) => {
    const updatedEvents = events.filter(
      (_, index) => index !== indexToDelete
    );

    setEvents(updatedEvents);
  };

  const generateMessage = (event) => {
    const relation = event.relation.toLowerCase();

    if (event.eventType === "Birthday") {

      if (relation.includes("mother")) {
        return `Happy Birthday Mom ❤️
Thank you for always supporting and loving me unconditionally.`;
      }

      if (relation.includes("father")) {
        return `Happy Birthday Dad 🎉
Your guidance and strength inspire me every day.`;
      }

      if (
        relation.includes("girlfriend") ||
        relation.includes("boyfriend")
      ) {
        return `Happy Birthday Love ❤️
You make life beautiful and special every single day.`;
      }

      if (relation.includes("friend")) {
        return `Happy Birthday Buddy 🎂
Wishing you success, happiness and unforgettable memories.`;
      }

      return `Happy Birthday ${event.name}! 🎉
Wishing you joy, success and happiness always.`;
    }

    if (event.eventType === "Anniversary") {
      return `Happy Anniversary ❤️
Wishing you both endless love and beautiful memories together.`;
    }

    if (event.eventType === "Meeting") {
      return `Reminder 📅
You have an important meeting with ${event.name}.`;
    }

    return `Special wishes to ${event.name}! ✨`;
  };

  const recommendGift = (relation) => {
    const lowerRelation = relation.toLowerCase();

    if (lowerRelation.includes("mother")) {
      return {
        name: "Jewelry Gift Set",
        link: "https://www.amazon.in/s?k=jewelry+gift+for+mom",
      };
    }

    if (lowerRelation.includes("father")) {
      return {
        name: "Luxury Watch",
        link: "https://www.amazon.in/s?k=watch+for+dad",
      };
    }

    if (lowerRelation.includes("friend")) {
      return {
        name: "Wireless Headphones",
        link: "https://www.amazon.in/s?k=headphones+gift",
      };
    }

    if (
      lowerRelation.includes("girlfriend") ||
      lowerRelation.includes("boyfriend")
    ) {
      return {
        name: "Romantic Gift Box",
        link: "https://www.amazon.in/s?k=romantic+gift",
      };
    }

    return {
      name: "Gift Card",
      link: "https://www.amazon.in/s?k=gift+card",
    };
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        <div className="mb-10">
          <h1 className="text-5xl font-bold mb-3">
            Bondly AI ❤️
          </h1>

          <p className="text-gray-400 text-lg">
            AI-powered relationship reminder assistant
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">

          <div className="bg-gray-900 p-6 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-semibold mb-6">
              Add Event
            </h2>

            <div className="flex flex-col gap-4">

              <input
                type="text"
                placeholder="Person Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-3 rounded-lg bg-gray-800 border border-gray-700"
              />

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="p-3 rounded-lg bg-gray-800 border border-gray-700"
              />

              <input
                type="text"
                placeholder="Relation"
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                className="p-3 rounded-lg bg-gray-800 border border-gray-700"
              />

              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="p-3 rounded-lg bg-gray-800 border border-gray-700"
              >
                <option>Birthday</option>
                <option>Anniversary</option>
                <option>Meeting</option>
                <option>Custom Event</option>
              </select>

              <button
                onClick={handleSubmit}
                className="bg-pink-500 hover:bg-pink-600 transition-all p-3 rounded-lg font-semibold"
              >
                Save Event
              </button>

            </div>
          </div>

          <div>

            <h2 className="text-2xl font-semibold mb-6">
              Upcoming Events
            </h2>

            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 mb-6 rounded-lg bg-gray-800 border border-gray-700"
            />

            <div className="flex flex-col gap-5">

              {[...events]
                .filter((event) =>
                  event.name
                    .toLowerCase()
                    .includes(search.toLowerCase())
                )
                .sort((a, b) => {
                  const today = new Date();

                  const dateA = new Date(a.date);
                  const dateB = new Date(b.date);

                  dateA.setFullYear(today.getFullYear());
                  dateB.setFullYear(today.getFullYear());

                  if (dateA < today) {
                    dateA.setFullYear(today.getFullYear() + 1);
                  }

                  if (dateB < today) {
                    dateB.setFullYear(today.getFullYear() + 1);
                  }

                  return dateA - dateB;
                })
                .map((event, index) => {
                  const today = new Date();

                  const eventDate = new Date(event.date);

                  eventDate.setFullYear(today.getFullYear());

                  if (eventDate < today) {
                    eventDate.setFullYear(
                      today.getFullYear() + 1
                    );
                  }

                  const differenceInTime =
                    eventDate.getTime() - today.getTime();

                  const daysLeft = Math.ceil(
                    differenceInTime /
                      (1000 * 60 * 60 * 24)
                  );

                  return (
                    <div
                      key={index}
                      className="bg-gray-900 p-5 rounded-2xl shadow-lg border border-gray-800"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-2xl font-bold mb-2">
                            {event.name}
                          </h3>

                          <p className="text-gray-300">
                            🎂 {event.date}
                          </p>

                          <p className="text-gray-300">
                            ❤️ {event.relation}
                          </p>

                          <p className="text-gray-300">
                            📌 {event.eventType}
                          </p>

                          <p className="text-pink-400 font-semibold mt-3">
                            ⏳ {daysLeft} days remaining
                          </p>
                        </div>

                        <button
                          onClick={() => deleteEvent(index)}
                          className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg"
                        >
                          Delete
                        </button>
                      </div>

                      <div className="mt-5 bg-gray-800 p-4 rounded-xl">
                        <p className="text-gray-200 whitespace-pre-line">
                          💌 {generateMessage(event)}
                        </p>
                      </div>

                      <div className="mt-4 bg-pink-500/10 border border-pink-500 p-4 rounded-xl">
                        <a
                          href={recommendGift(event.relation).link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-pink-300 font-semibold underline"
                        >
                          🎁 {recommendGift(event.relation).name}
                        </a>
                      </div>

                    </div>
                  );
                })}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}