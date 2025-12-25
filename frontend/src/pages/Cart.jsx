import { useEffect, useState } from "react";

export default function Cart() {
  const [cart, setCart] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setCart(data))
      .catch(err => {
        console.error("Error loading cart", err);
        setCart(null);
      });
  }, []);

  const remove = (id) => {
    const token = localStorage.getItem("token");

    fetch(`/cart/remove/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => {
      setCart(prev => ({
        ...prev,
        services: prev.services.filter(s => s._id !== id),
      }));
    });
  };

  if (!cart) return <p>Loading...</p>;

  return (
    <div className="container">
      <h1>Cart</h1>

      {cart.services.length === 0 && <p>Cart is empty</p>}

      {cart.services.map(s => (
        <div key={s._id}>
          {s.name} — {s.price}
          <button onClick={() => remove(s._id)}>X</button>
        </div>
      ))}
    </div>
  );
}
