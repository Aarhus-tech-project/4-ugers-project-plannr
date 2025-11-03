using Plannr.Api.Models;
using System.Collections.Concurrent;
using System.Text.Json;

namespace Plannr.Helpers
{
    public class EventHelper
    {
        public static void Seed(IEventStore store)
        {
            if (store.Any()) return;

            var owner = new Profile
            {
                Id = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                Email = "owner@example.com",
                Name = "Event Owner"
            };
            store.UpsertUser(owner);

            var ev = new Event
            {
                Id = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
                Title = "Fredagsbar i kælderen",
                Description = "Medbring snacks. Starter kl. 18.",
                CreatorId = owner.Id,
                Format = "inperson",
                StartAt = DateTimeOffset.UtcNow.AddDays(2),
                EndAt = DateTimeOffset.UtcNow.AddDays(2).AddHours(4),
                Location = new EventLocation
                {
                    Address = "Nørregade 10, 8000 Aarhus C",
                    City = "Aarhus",
                    Country = "Denmark",
                    Latitude = 56.162939m,
                    Longitude = 10.203921m,
                    Venue = "Kælderen"
                },
                Access = new EventAccess { Instruction = "Ring på ved kælderdøren", Password = null },
                Attendance = new EventAttendance { Interested = 12, Going = 8, CheckedIn = 0 },
                Themes = new List<string> { "Social", "Party" },
                Sections = JsonDocument.Parse(@"[
  { ""type"": ""description"", ""content"": ""Husk at tage en ven med."" },
  { ""type"": ""map"", ""latitude"": 56.162939, ""longitude"": 10.203921 }
]"),
            };

            store.UpsertEvent(ev);
        }

        public interface IEventStore
        {
            IEnumerable<Event> GetEvents();

            Event? GetEvent(Guid id);

            void UpsertEvent(Event e);

            IEnumerable<Profile> GetUsers();

            Profile? GetUser(Guid id);

            void UpsertUser(Profile u);

            bool Any();
        }

        public class InMemoryEventStore : IEventStore
        {
            private readonly ConcurrentDictionary<Guid, Event> _events = new();
            private readonly ConcurrentDictionary<Guid, Profile> _users = new();

            public IEnumerable<Event> GetEvents() => _events.Values.OrderBy(e => e.StartAt);

            public Event? GetEvent(Guid id) => _events.TryGetValue(id, out var e) ? e : null;

            public void UpsertEvent(Event e) => _events[e.Id == Guid.Empty ? Guid.NewGuid() : e.Id] = e;

            public IEnumerable<Profile> GetUsers() => _users.Values;

            public Profile? GetUser(Guid id) => _users.TryGetValue(id, out var u) ? u : null;

            public void UpsertUser(Profile u) => _users[u.Id == Guid.Empty ? Guid.NewGuid() : u.Id] = u;

            public bool Any() => _events.Count > 0 || _users.Count > 0;
        }
    }
}