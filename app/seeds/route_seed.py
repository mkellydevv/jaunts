from app.models import db, Route

def seed_routes():
    with open("selenium/states/virginia/links.txt", "r") as f:
        urls = f.readlines()
        urls = urls[0:100]

        # Extract trail name from url
        for i in range(len(urls)):
            s = urls[i]
            urls[i] = s[slice(44, len(s) - 1)].split('?')[0]

    for i in range(1):
        trail_name = urls[i]
        with open(f"selenium/states/virginia/routes/{trail_name}.csv") as f:
            # Latitude Longitude Elevation
            route_data = f.readlines()

            coordinates = []

            j = 1
            while j < len(route_data):
                line = route_data[j].split(',')
                coordinates.append(float(line[0]))
                coordinates.append(float(line[1]))
                coordinates.append(float(line[2]))
                j += 1

            route = Route(
                trail_id=i+1,
                coordinates=coordinates
            )
            db.session.add(route)
            db.session.commit()









    # with open("selenium/states/virginia/reviews.csv", "r") as f:
    #     data = json.load(f)
    #     reviews = data['reviews_3']

    # for i in range(5):
    #     lst = List(
    #         user_id=1,
    #         blurb=random.choice(reviews),
    #         name=f"VA List 202{i}",
    #         private=False
    #     )
    #     db.session.add(lst)
    # db.session.commit()

def undo_routes():
    db.session.execute('TRUNCATE routes RESTART IDENTITY CASCADE;')
    db.session.commit()
