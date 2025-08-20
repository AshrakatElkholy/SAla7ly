const PastOrdersProvider = ({ navigation, token }) => {
  const BASE_URL = "https://7a6280fbc949.ngrok-free.app";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/provider/getMyOrders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allOrders = res.data || [];
      const pastOrders = allOrders
        .filter((order) =>
          ["completed", "rejected", "canceled"].includes(
            order.status?.toLowerCase()
          )
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setOrders(pastOrders);
    } catch (err) {
      console.error("Error fetching past orders:", err.message);
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  if (loading) return <ActivityIndicator size="large" color="#4F77F7" />;
  if (orders.length === 0) return <EmptyState message="لا يوجد طلبات منتهية" />;

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {orders.map((order) => (
        <ProviderOrderCard
          key={order._id}
          service={order}
          navigation={navigation}
          token={token}
          baseUrl={BASE_URL}
        />
      ))}
    </ScrollView>
  );
};
